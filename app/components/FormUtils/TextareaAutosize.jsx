import React from 'react'
import styled from 'styled-components'
import * as styledSystem from 'styled-system'

const TextArea = styled.textarea`
  resize: none !important;
  ${styledSystem.minHeight}
  ${styledSystem.maxHeight}
  ${styledSystem.height}
`

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

  _handleChange = e => {
    const { onChange } = this.props
    if (onChange) onChange(e)
    this._adjustHeight(e.target)
  }

  _adjustHeight(target) {
    // Reset height to 0 so component will auto-size
    target.style.height = 0
    // Use the scroll height to define size
    target.style.height = `${target.scrollHeight + 2}px` // +2px for borders
  }

  render() {
    const { onChange, focus, ...props } = this.props
    return (
      <TextArea
        className="textarea"
        ref={this.textarea}
        onChange={this._handleChange}
        resize
        {...props}
      />
    )
  }
}
