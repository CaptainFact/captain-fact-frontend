import { Box, Flex } from '@rebass/grid'
import { Formik } from 'formik'
import React from 'react'
import { withNamespaces } from 'react-i18next'
import ReactPlayer from 'react-player'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Eye } from 'styled-icons/fa-regular'
import { EyeSlash } from 'styled-icons/fa-regular'

import { MIN_REPUTATION_ADD_UNLISTED_VIDEO, MIN_REPUTATION_ADD_VIDEO } from '../../constants'
import { LOCAL_STORAGE_KEYS } from '../../lib/local_storage'
import { facebookVideoRegex, youtubeRegex } from '../../lib/url_utils'
import { postVideo, searchVideo } from '../../state/videos/effects'
import FieldWithButton from '../FormUtils/FieldWithButton'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import DismissableMessage from '../Utils/DismissableMessage'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Message from '../Utils/Message'
import ReputationGuardTooltip from '../Utils/ReputationGuardTooltip'
import StyledToggle from '../Utils/StyledToggle'

const validate = ({ url }) => {
  if (!youtubeRegex.test(url) && !facebookVideoRegex.test(url)) {
    return {
      url: 'Invalid URL. Only YouTube and Facebook videos are currently supported',
    }
  }
  return {}
}

@withRouter
@withNamespaces('main')
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
      <div className="video">
        <div />
      </div>
    ) : (
      <ReactPlayer className="video" url={value} controls width="" height="" />
    )
  }

  renderVideoAdvice() {
    const { t } = this.props
    return (
      <Box mb={2}>
        <Message header={t('videos.adviceTitle')}>
          <div className="content">
            <p>{t('videos.advice1')}</p>
            <ul>
              <li>{t('videos.adviceBulletPoint1')}</li>
              <li>{t('videos.adviceBulletPoint2')}</li>
              <li>{t('videos.adviceBulletPoint3')}</li>
              <li>{t('videos.adviceBulletPoint4')}</li>
            </ul>
            <ExternalLinkNewTab href="/help/contributionGuidelines">
              {t('videos.adviceReadMoreLink')}
            </ExternalLinkNewTab>
          </div>
        </Message>
      </Box>
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
        {({ handleSubmit, handleChange, handleBlur, values, errors, isSubmitting }) => (
          <div id="video-show" className="columns is-gapless">
            <form id="col-video" className="column is-4 form" onSubmit={handleSubmit}>
              {this.renderVideo(values.url, errors.url)}
              <Box p={2}>
                <DismissableMessage
                  className="introduction"
                  header={t('videos.introTitle')}
                  localStorageDismissKey={LOCAL_STORAGE_KEYS.DISMISS_ADD_VIDEO_INTRODUCTION}
                >
                  <p>{t('videos.intro')}</p>
                  <p>
                    <ExternalLinkNewTab href="/extension">
                      {t('videos.seeExtension')}
                    </ExternalLinkNewTab>
                  </p>
                  <br />
                  <p>
                    <b>{t('videos.intro2', { requiredPoints: MIN_REPUTATION_ADD_VIDEO })}</b>
                  </p>
                  <p>
                    <ExternalLinkNewTab href="/help/contact">
                      {t('videos.contact')}
                    </ExternalLinkNewTab>
                  </p>
                  <br />
                  <p>{t('videos.supportedPlatforms')}</p>
                </DismissableMessage>
                {this.renderVideoAdvice()}
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
                  buttonClassName="is-primary"
                  meta={{ invalid: errors.url, submitting: isSubmitting }}
                  expandInput
                />
              </Box>

              <Flex flexDirection="column" justifyContent="center" alignItems="center" py={4}>
                <ReputationGuardTooltip requiredRep={MIN_REPUTATION_ADD_VIDEO}>
                  {({ hasReputation }) => (
                    <StyledToggle
                      name="isPublicVideo"
                      onChange={hasReputation ? handleChange : () => undefined}
                      checked={values.isPublicVideo}
                      size="1.5em"
                      label={t(values.isPublicVideo ? 'videos.public' : 'videos.unlisted')}
                      mb={4}
                    />
                  )}
                </ReputationGuardTooltip>

                <Box width={0.8}>
                  <Message>
                    <Eye size="1em" />
                    &nbsp; {t('videos.publicDescription')} (
                    <ExternalLinkNewTab href="/help/privileges">
                      {t('videos.requiredPoints', { requiredPoints: MIN_REPUTATION_ADD_VIDEO })}
                    </ExternalLinkNewTab>
                    )
                    <br />
                    <br />
                    <EyeSlash size="1em" />
                    &nbsp; {t('videos.unlistedDescription')} (
                    <ExternalLinkNewTab href="/help/privileges">
                      {t('videos.requiredPoints', {
                        requiredPoints: MIN_REPUTATION_ADD_UNLISTED_VIDEO,
                      })}
                    </ExternalLinkNewTab>
                    )
                  </Message>
                </Box>
              </Flex>
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
