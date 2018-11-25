import React from 'react'
import { reduxForm } from 'redux-form'
import FlagReasonSelect from '../Moderation/FlagReasonSelect'

import { CommentDisplay } from './CommentDisplay'

@reduxForm({ form: 'flagForm' })
export default class FlagForm extends React.PureComponent {
  render() {
    const { handleSubmit } = this.props

    return (
      <form className="form flag-form" onSubmit={handleSubmit}>
        <CommentDisplay
          comment={this.props.comment}
          withoutActions
          hideThread
        />
        <hr />
        <FlagReasonSelect />
      </form>
    )
  }
}
