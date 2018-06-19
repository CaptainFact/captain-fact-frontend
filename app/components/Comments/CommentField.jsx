import React from 'react'

import TextareaAutosize from '../FormUtils/TextareaAutosize'
import TextareaLengthCounter from '../FormUtils/TextareaLengthCounter'
import { COMMENT_LENGTH } from '../../constants'

export default class CommentField extends React.PureComponent {
  render() {
    const { input, meta: { submitting, error }, autoFocus = false } = this.props

    return (
      <p className="control">
        <TextareaAutosize
          {...input}
          placeholder={this.props.placeholder || this.props.label}
          disabled={submitting}
          focus={this.props.isReply}
          autoFocus={autoFocus}
        />
        <TextareaLengthCounter
          length={input.value.length} 
          maxLength={COMMENT_LENGTH[1]}
        />
        {error &&
          <span className="help is-danger">
            {typeof (error) === 'string' ? error : error[0]}
          </span>
        }
      </p>
    )
  }
}
