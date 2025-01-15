import { omit } from 'lodash'
import React from 'react'

import { cn } from '@/lib/css-utils'

import { Textarea } from '../ui/textarea'

/**
 * A textarea that grows with its content.
 */
export default class TextareaAutosize extends React.PureComponent {
  constructor(props) {
    super(props)
    this.textarea = React.createRef()
  }

  componentDidMount() {
    this._adjustHeight(this.textarea.current)
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.focus && this.props.focus) {
      this.textarea.current.focus()
    }
  }

  _handleChange = (e) => {
    const { onChange } = this.props
    if (onChange) {
      onChange(e)
    }
    this._adjustHeight(e.target)
  }

  _adjustHeight(target) {
    // Reset height to 0 so component will auto-size
    target.style.height = 0
    // Use the scroll height to define size
    target.style.height = `${target.scrollHeight + 2}px` // +2px for borders
  }

  render() {
    return (
      <Textarea
        className={cn('resize-none', this.props.className)}
        ref={this.textarea}
        onChange={this._handleChange}
        resize
        {...omit(this.props, ['onChange', 'focus'])}
      />
    )
  }
}
