import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { Eye, EyeOff } from 'lucide-react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'
import { useHistory, useParams } from 'react-router-dom'

import { cn } from '@/lib/css-utils'

import { CREATE_VIDEO_MUTATION, SEARCH_VIDEO_QUERY } from '../../API/graphql_queries'
import { MIN_REPUTATION_ADD_UNLISTED_VIDEO, MIN_REPUTATION_ADD_VIDEO } from '../../constants'
import { facebookVideoRegex, youtubeRegex } from '../../lib/url_utils'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { LoadingFrame } from '../Utils/LoadingFrame'
import ReputationGuardTooltip from '../Utils/ReputationGuardTooltip'

const validate = ({ url }) => {
  if (!youtubeRegex.test(url) && !facebookVideoRegex.test(url)) {
    return {
      url: 'Invalid URL. Only YouTube and Facebook videos are currently supported',
    }
  }
  return {}
}

const renderVideo = (value, error) => {
  return error || !value ? (
    <div className="w-full aspect-video bg-gray-100">
      <div />
    </div>
  ) : (
    <ReactPlayer className="w-full aspect-video" url={value} controls />
  )
}

const renderVideoAdvice = (t) => {
  return (
    <Card className="mb-4 mx-2 md:mx-auto w-full md:max-w-[600px] mt-32">
      <CardHeader>
        <CardTitle>{t('videos.adviceTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{t('videos.advice1')}</p>
        <ul className="list-disc pl-6 space-y-1 mb-5">
          <li>{t('videos.adviceBulletPoint1')}</li>
          <li>{t('videos.adviceBulletPoint2')}</li>
          <li>{t('videos.adviceBulletPoint3')}</li>
          <li>{t('videos.adviceBulletPoint4')}</li>
        </ul>
      </CardContent>
      <CardFooter>
        <ExternalLinkNewTab href="/help/contributionGuidelines">
          {t('videos.adviceReadMoreLink')}
        </ExternalLinkNewTab>
      </CardFooter>
    </Card>
  )
}

const AddVideoForm = () => {
  const { t } = useTranslation('main')
  const history = useHistory()
  const { videoUrl, url: initialURL } = useParams()
  const { isAuthenticated, loggedInUser } = useLoggedInUser()

  const [createVideo, { loading: creatingVideo }] = useMutation(CREATE_VIDEO_MUTATION)
  const [searchVideoQuery] = useMutation(SEARCH_VIDEO_QUERY)

  useEffect(() => {
    if (videoUrl) {
      searchVideoQuery({
        variables: { url: decodeURI(videoUrl) },
      })
        .then((result) => {
          if (result.data?.searchVideo) {
            history.push(`/videos/${result.data.searchVideo.hashId}`)
          }
        })
        .catch((error) => {
          console.error('Error searching video:', error)
        })
    }
  }, [videoUrl, searchVideoQuery, history])

  return (
    <Formik
      initialValues={{
        url: initialURL,
        isPublicVideo: loggedInUser.reputation >= MIN_REPUTATION_ADD_UNLISTED_VIDEO ? true : false,
      }}
      validate={validate}
      onSubmit={async ({ url, isPublicVideo }, { setSubmitting }) => {
        setSubmitting(true)
        try {
          const result = await createVideo({
            variables: { url, unlisted: !isPublicVideo },
          })
          if (result.data?.createVideo) {
            history.push(`/videos/${result.data.createVideo.hashId}`)
          }
        } catch (error) {
          console.error('Error creating video:', error)
          if (error.message?.includes('unauthorized') && !isAuthenticated) {
            history.push('/login')
          }
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {({
        handleSubmit,
        handleChange,
        setFieldValue,
        handleBlur,
        values,
        errors,
        isSubmitting,
      }) => (
        <div className="grid grid-cols-1 md:grid-cols-4">
          <form
            className="md:col-span-1 bg-white border-r h-[--main-height]"
            onSubmit={handleSubmit}
          >
            {renderVideo(values.url, errors.url)}
            <div className="p-4">
              <div className="flex items-center">
                <Input
                  name="url"
                  value={values.url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t('videos.placeholder')}
                  className={cn('rounded-tr-none rounded-br-none', {
                    'border-red-500': errors.url && values.url,
                  })}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || (errors.url && values.url)}
                  className="rounded-tl-none rounded-bl-none whitespace-nowrap"
                  loading={isSubmitting}
                >
                  {t('videos.addThis')}
                </Button>
              </div>
            </div>

            <ReputationGuardTooltip requiredRep={MIN_REPUTATION_ADD_VIDEO}>
              {({ hasReputation }) => (
                <div className="flex items-center space-x-2 mb-4 pl-5">
                  <Switch
                    id="switch-isPublicVideo"
                    checked={values.isPublicVideo}
                    disabled={!hasReputation}
                    onCheckedChange={(checked) => setFieldValue('isPublicVideo', checked)}
                  />
                  <label className="min-w-28 cursor-pointer" htmlFor="switch-isPublicVideo">
                    {t(values.isPublicVideo ? 'videos.public' : 'videos.unlisted')}
                  </label>
                </div>
              )}
            </ReputationGuardTooltip>

            <Card className="pt-4 mx-4 text-sm">
              <CardContent>
                <div
                  className={cn('flex items-center', {
                    'font-bold': values.isPublicVideo,
                  })}
                >
                  <Eye size={24} className="mr-4" />
                  <span>{t('videos.publicDescription')}</span>
                </div>
                <div
                  className={cn('flex items-center mt-4', {
                    'font-bold': !values.isPublicVideo,
                  })}
                >
                  <EyeOff size={42} className="mr-4" />
                  <span>{t('videos.unlistedDescription')}</span>
                </div>
              </CardContent>
            </Card>
          </form>

          <div className="md:col-span-3">
            {isSubmitting ? <LoadingFrame title={t('videos.analysing')} /> : renderVideoAdvice(t)}
          </div>
        </div>
      )}
    </Formik>
  )
}

export default AddVideoForm
