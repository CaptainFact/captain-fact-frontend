import { Formik } from 'formik'
import { Eye, EyeOff } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { cn } from '@/lib/css-utils'

import { MIN_REPUTATION_ADD_UNLISTED_VIDEO, MIN_REPUTATION_ADD_VIDEO } from '../../constants'
import { facebookVideoRegex, youtubeRegex } from '../../lib/url_utils'
import { postVideo, searchVideo } from '../../state/videos/effects'
import FieldWithButton from '../FormUtils/FieldWithButton'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
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

@withRouter
@withTranslation('main')
@connect(null, { postVideo, searchVideo })
@withLoggedInUser
export class AddVideoForm extends React.PureComponent {
  componentDidMount() {
    const searchParams = new URLSearchParams(location.search)
    const videoUrl = this.props.match.params.videoUrl || searchParams.get('videoUrl')
    if (videoUrl) {
      this.props.searchVideo(decodeURI(videoUrl)).then((action) => {
        if (!action.error && action.payload !== null) {
          this.props.history.push(`/videos/${action.payload.hash_id}`)
        }
      })
    }
  }

  renderVideo = (value, error) => {
    return error || !value ? (
      <div className="w-full aspect-video bg-gray-100">
        <div />
      </div>
    ) : (
      <ReactPlayer className="w-full aspect-video" url={value} controls />
    )
  }

  renderVideoAdvice() {
    const { t } = this.props
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

  render() {
    const { t, match, location, history, isAuthenticated, loggedInUser } = this.props
    const searchParams = new URLSearchParams(location.search)
    const initialURL = match.params.videoUrl || searchParams.get('url') || ''
    return (
      <Formik
        initialValues={{
          url: initialURL,
          isPublicVideo:
            loggedInUser.reputation >= MIN_REPUTATION_ADD_UNLISTED_VIDEO ? true : false,
        }}
        validate={validate}
        onSubmit={({ url, isPublicVideo }, { setSubmitting }) => {
          setSubmitting(true)
          this.props.postVideo({ url, unlisted: !isPublicVideo }).then((action) => {
            setSubmitting(false)
            if (!action.error) {
              history.push(`/videos/${action.payload.hash_id}`)
            } else if (action.payload === 'unauthorized' && !isAuthenticated) {
              history.push('/login')
            }
          })
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
              {this.renderVideo(values.url, errors.url)}
              <div className="p-4">
                <FieldWithButton
                  input={{
                    onChange: handleChange,
                    onBlur: handleBlur,
                    name: 'url',
                    value: values.url,
                  }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  buttonLabel={this.props.t('videos.addThis')}
                  placeholder={this.props.t('videos.placeholder')}
                  meta={{ invalid: errors.url && values.url, submitting: isSubmitting }}
                  expandInput
                />
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
              {isSubmitting ? (
                <LoadingFrame title={this.props.t('videos.analysing')} />
              ) : (
                this.renderVideoAdvice()
              )}
            </div>
          </div>
        )}
      </Formik>
    )
  }
}
