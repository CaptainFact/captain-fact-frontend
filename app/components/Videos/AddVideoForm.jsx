import React from 'react'
import { withRouter } from 'react-router'
import { withNamespaces } from 'react-i18next'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import trim from 'voca/trim'
import ReactPlayer from 'react-player'

import { youtubeRegex } from '../../lib/url_utils'
import FieldWithButton from '../FormUtils/FieldWithButton'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { postVideo, searchVideo } from '../../state/videos/effects'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'

const validate = ({ url }) => {
  if (!youtubeRegex.test(url))
    return { url: 'Invalid URL. Only youtube videos are currently supported' }
  return {}
}

@withRouter
@withNamespaces('main')
@connect(
  (state, props) => ({
    initialValues: { url: props.params.videoUrl || props.location.query.url },
    isSubmitting: state.Videos.isSubmitting
  }),
  { postVideo, searchVideo }
)
@reduxForm({ form: 'AddVideo', validate })
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

  render() {
    return (
      <div id="video-show" className="columns is-gapless">
        <form
          id="col-video"
          className="column is-4 form"
          onSubmit={this.props.handleSubmit(this.handleSubmit.bind(this))}
        >
          <Field
            component={this.renderVideoField}
            name="url"
            buttonLabel={this.props.t('videos.add')}
            placeholder={this.props.t('videos.placeholder')}
            buttonClassName="is-primary"
            normalize={s => trim(s)}
            expandInput
          />
        </form>
        <div id="col-debate" className="column">
          {this.props.isSubmitting && (
            <LoadingFrame title={this.props.t('videos.analysing')} />
          )}
        </div>
      </div>
    )
  }

  renderVideoField = field => {
    const {
      meta: { error },
      input: { value }
    } = field
    const urlInput = FieldWithButton(field)

    return (
      <div>
        {!error && (
          <ReactPlayer className="video" url={value} controls width="" height="" />
        )}
        {error && (
          <div className="video">
            <div />
          </div>
        )}
        {urlInput}
      </div>
    )
  }

  handleSubmit(video) {
    return this.props.postVideo(video).then(action => {
      if (!action.error) {
        this.props.router.push(`/videos/${action.payload.hash_id}`)
      } else if (action.payload === 'unauthorized' && !this.props.isAuthenticated) {
        this.props.router.push('/login')
      }
    })
  }
}
