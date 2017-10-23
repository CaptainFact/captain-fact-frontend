import React from "react"
import { Link, withRouter } from "react-router"

import { Icon } from "./Icon"


@withRouter
export class ActiveLink extends React.PureComponent {
  render() {
    const {router, params, location, routes, className, iconName, children, exact, ...props} = this.props
    let isActive
    if (exact)
      isActive = location && location.pathname === props.to
    else
      isActive = location && location.pathname.startsWith(props.to)
    return (
      <Link
        className={`${iconName ? 'link-with-icon ' : ''}${isActive ? 'is-active ' : ''}${className || ''}`}
        {...props}>
          {iconName && <Icon name={iconName} withContainer={false} />}
          <span>{children}</span>
      </Link>
    )
  }
}
