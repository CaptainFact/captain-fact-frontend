import React from 'react'
import { withRouter } from 'react-router'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import ReactPlayer from 'react-player'
import { Flex, Box } from '@rebass/grid'
import { Formik } from 'formik'

import { Eye } from 'styled-icons/fa-regular/Eye'
import { EyeSlash } from 'styled-icons/fa-regular/EyeSlash'

import { youtubeRegex } from '../../lib/url_utils'
import FieldWithButton from '../FormUtils/FieldWithButton'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { postVideo, searchVideo } from '../../state/videos/effects'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import StyledToggle from '../Utils/StyledToggle'
import Message from '../Utils/Message'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

const validate = ({ url }) => {
  if (!youtubeRegex.test(url))
    return { url: 'Invalid URL. Only youtube videos are currently supported' }
  return {}
}

@withRouter
@withNamespaces('main')
@connect(null, { postVideo, searchVideo })
@withLoggedInUser
export class AddVideoForm extends React.PureComponent {
  componentDidMount() {
    const videoUrl = this.props.params.videoUrl || this.props.location.query.url
    if (videoUrl) {
      this.props.searchVideo(decodeURI(videoUrl)).then(action => {
        if (!action.error && action.payload !== null)
          this.props.router.push(`/videos/${action.payload.hash_id}`)
      })
    }
  }

  renderVideo = (value, error) => {
    return error || !value ? (
      <div className="video">
        <div />
      </div>
    ) : (
      <ReactPlayer className="video" url={value} controls width="" height="" />
    )
  }

  render() {
    const { t, params, location, router, isAuthenticated } = this.props
    const initialURL = params.videoUrl || location.query.url
    return (
      <Formik
        initialValues={{ url: initialURL, isPublicVideo: true }}
        validate={validate}
        onSubmit={({ url, isPublicVideo }, { setSubmitting }) => {
          setSubmitting(true)
          this.props.postVideo({ url, unlisted: !isPublicVideo }).then(action => {
            setSubmitting(false)
            if (!action.error) {
              router.push(`/videos/${action.payload.hash_id}`)
            } else if (action.payload === 'unauthorized' && !isAuthenticated) {
              router.push('/login')
            }
          })
        }}
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors, isSubmitting }) => (
          <div id="video-show" className="columns is-gapless">
            <form id="col-video" className="column is-4 form" onSubmit={handleSubmit}>
              <Message className="introduction" header={t('videos.introTitle')}>
                <p>{t('videos.intro')}</p>
                <p>
                  <ExternalLinkNewTab href="/extension">
                    {t('videos.seeExtension')}
                  </ExternalLinkNewTab>
                </p>
                <br />
                <p>
                  <b>{t('videos.intro2')}</b>
                </p>
                <p>
                  <ExternalLinkNewTab href="/help/contact">
                    {t('videos.contact')}
                  </ExternalLinkNewTab>
                </p>
              </Message>

              <FieldWithButton
                input={{
                  onChange: handleChange,
                  onBlur: handleBlur,
                  name: 'url',
                  value: values.url
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                buttonLabel={this.props.t('videos.addThis')}
                placeholder={this.props.t('videos.placeholder')}
                buttonClassName="is-primary"
                meta={{ invalid: errors.url, submitting: isSubmitting }}
                expandInput
              />
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                py={4}
              >
                <StyledToggle
                  name="isPublicVideo"
                  onChange={handleChange}
                  checked={values.isPublicVideo}
                  size="1.5em"
                  label={t(values.isPublicVideo ? 'videos.public' : 'videos.unlisted')}
                  mb={4}
                />
                <Box width={0.8}>
                  <Message>
                    <Eye size="1em" />
                    &nbsp; {t('videos.publicDescription')}
                    <br />
                    <br />
                    <EyeSlash size="1em" />
                    &nbsp; {t('videos.unlistedDescription')}
                  </Message>
                </Box>
              </Flex>
              {this.renderVideo(values.url, errors.url)}
            </form>

            <div id="col-debate" className="column">
              {isSubmitting && <LoadingFrame title={this.props.t('videos.analysing')} />}
            </div>
          </div>
        )}
      </Formik>
    )
  }
}
