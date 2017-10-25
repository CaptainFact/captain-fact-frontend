import React from "react"
import { Link, withRouter } from "react-router"

import { Icon } from "./Icon"


@withRouter
export class ActiveLink extends React.PureComponent {
  render() {
    const {router, params, location, routes, className, iconName, children, exact, ignoreRoutes, ...props} = this.props
    let active = true
    if (ignoreRoutes && location && ignoreRoutes.includes(location.pathname))
      active = false
    else
      active = exact ? (location && location.pathname === props.to) : (location && location.pathname.startsWith(props.to))

    return (
      <Link
        className={`${iconName ? 'link-with-icon ' : ''}${active ? 'is-active ' : ''}${className || ''}`}
        {...props}>
          {iconName && <Icon name={iconName} withContainer={false} />}
          <span>{children}</span>
      </Link>
    )
  }
}
