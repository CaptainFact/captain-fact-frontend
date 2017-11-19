import React from "react"
import { withRouter } from "react-router"
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import trim from 'voca/trim'

import { youtubeRegex } from '../../lib/url_utils'
import { DummyVideoPlayer } from "../Videos"
import { FieldWithButton } from "../FormUtils"
import { LoadingFrame } from '../Utils/LoadingFrame'
import { postVideo } from '../../state/videos/effects'
import { isAuthenticated } from '../../state/users/current_user/selectors'


const validate = ({ url }) => {
  if (!youtubeRegex.test(url))
    return {url: "Invalid URL. Only youtube videos are currently supported"}
  return {}
}

const renderVideoField = (field) => {
  const { meta: {error}, input: {value} } = field
  const urlInput = FieldWithButton(field)

  return (<div>
    {!error && <DummyVideoPlayer url={value}/>}
    {error && <div className="video"><div></div></div>}
    {urlInput}
  </div>)
}

@withRouter
@connect((state, props) => ({
  initialValues: {url: props.params.videoUrl},
  isSubmitting: state.Videos.isSubmitting,
  isAuthenticated: isAuthenticated(state)
}), {postVideo})
@reduxForm({form: 'AddVideo', validate})
export class AddVideoForm extends React.PureComponent {
  componentDidMount() {
    if (this.props.params.videoUrl)
      this.handleSubmit({url: this.props.params.videoUrl})
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

  render() {
    return (
      <div id="video-show" className="columns is-gapless">
        <form id="col-video" className="column is-4 form"
          onSubmit={ this.props.handleSubmit(this.handleSubmit.bind(this)) }>
            <Field component={renderVideoField} name="url" buttonLabel="Add Video" placeholder="Video URL"
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
}
