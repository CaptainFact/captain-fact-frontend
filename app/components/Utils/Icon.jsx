import React from "react"

export class Icon extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  renderIcon(name) {
    return (<i className={`fa icon-${name}`}/>)
  }

  render() {
    const {name, size, withContainer, className, isClickable, ...otherProps} = this.props
    const sizeClass = size ? ` is-${size} ` : ' '
    if (withContainer)
      if (isClickable) return (
        <a className={`icon${sizeClass}${className}`} {...otherProps}>
          {this.renderIcon(name)}
        </a>
      )
      else return (
        <span className={`icon${sizeClass}${className}`} {...otherProps}>
          {this.renderIcon(name)}
        </span>
      )
    else return this.renderIcon(name)
  }
}

Icon.defaultProps = {
  withContainer: true,
  isClickable: false,
  size: "",
  name: "question",
  className: ''
}
