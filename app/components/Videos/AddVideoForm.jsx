import React from "react"
import { withRouter } from "react-router"
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import trim from 'voca/trim'
import ReactPlayer from 'react-player'

import { youtubeRegex } from '../../lib/url_utils'
import { FieldWithButton } from "../FormUtils"
import { LoadingFrame } from '../Utils/LoadingFrame'
import { postVideo, searchVideo } from '../../state/videos/effects'
import { isAuthenticated } from '../../state/users/current_user/selectors'


const validate = ({ url }) => {
  if (!youtubeRegex.test(url))
    return {url: "Invalid URL. Only youtube videos are currently supported"}
  return {}
}

@withRouter
@connect((state, props) => ({
  initialValues: {url: props.params.videoUrl},
  isSubmitting: state.Videos.isSubmitting,
  isAuthenticated: isAuthenticated(state)
}), {postVideo, searchVideo})
@reduxForm({form: 'AddVideo', validate})
export class AddVideoForm extends React.PureComponent {
  componentDidMount() {
    if (this.props.params.videoUrl) {
      this.props.searchVideo(decodeURI(this.props.params.videoUrl)).then(action => {
        if (!action.error && action.payload !== null)
          this.props.router.push(`/videos/${action.payload.id}`)
      })
    }
  }

  render() {
    return (
      <div id="video-show" className="columns is-gapless">
        <form id="col-video" className="column is-4 form"
          onSubmit={ this.props.handleSubmit(this.handleSubmit.bind(this)) }>
            <Field component={this.renderVideoField} name="url"
                   buttonLabel="Add Video" placeholder="Video URL"
                   buttonClassName="is-primary"
                   normalize={s => trim(s)}
            />
        </form>
        <div id="col-debate" className="column">
          {this.props.isSubmitting && <LoadingFrame title="Analysing video"/>}
        </div>
      </div>
    )
  }

  renderVideoField = (field) => {
    const { meta: {error}, input: {value} } = field
    const urlInput = FieldWithButton(field)

    return (
      <div>
        {!error &&
          <ReactPlayer className="video"
                       url={value}
                       controls={true}
                       width=""
                       height=""/>
        }
        {error && <div className="video"><div/></div>}
        {urlInput}
      </div>
    )
  }

  handleSubmit(video) {
    const promise = this.props.postVideo(video)
    return promise.then(action => {
      if (!action.error)
        this.props.router.push(`/videos/${action.payload.id}`)
      else if (action.payload === 'unauthorized' && !this.props.isAuthenticated)
        this.props.router.push('/login')
    })
  }
}
