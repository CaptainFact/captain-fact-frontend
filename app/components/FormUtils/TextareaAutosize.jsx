import React from "react"


export default class TextareaAutosize extends React.PureComponent {
  componentDidMount() {
    this._adjustHeight({})
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.focus && this.props.focus)
      this.refs.textarea.focus()
  }

  render() {
    const { onChange, focus, ...props } = this.props
    return (
      <textarea  className="textarea"
                 ref="textarea"
                 onChange={ this._handleChange.bind(this) }
                 {...props}
      />
    )
  }

  _handleChange(e) {
    const { onChange } = this.props
    if (onChange)
      onChange(e)
    this._adjustHeight(e)
  }

  _adjustHeight({ target = this.refs.textarea }) {
    target.style.height = 0
    target.style.height = `${target.scrollHeight + 2}px` // +2px for borders
  }
}