import React from 'react'
import { withRouter } from 'react-router'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import ReactPlayer from 'react-player'
import { Flex, Box } from '@rebass/grid'
import { Formik } from 'formik'

import { Eye } from 'styled-icons/fa-regular'
import { EyeSlash } from 'styled-icons/fa-regular'

import { youtubeRegex, facebookVideoRegex } from '../../lib/url_utils'
import FieldWithButton from '../FormUtils/FieldWithButton'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { postVideo, searchVideo } from '../../state/videos/effects'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import ReputationGuardTooltip from '../Utils/ReputationGuardTooltip'
import StyledToggle from '../Utils/StyledToggle'
import Message from '../Utils/Message'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { MIN_REPUTATION_ADD_VIDEO, MIN_REPUTATION_ADD_UNLISTED_VIDEO } from '../../constants'
import { LOCAL_STORAGE_KEYS } from '../../lib/local_storage'
import DismissableMessage from '../Utils/DismissableMessage'

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
    const videoUrl = this.props.params.videoUrl || this.props.location.query.url
    if (videoUrl) {
      this.props.searchVideo(decodeURI(videoUrl)).then((action) => {
        if (!action.error && action.payload !== null) {
          this.props.router.push(`/videos/${action.payload.hash_id}`)
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
    const { t, params, location, router, isAuthenticated, loggedInUser } = this.props
    const initialURL = params.videoUrl || location.query.url
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
