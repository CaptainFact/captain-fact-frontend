import React from "react"
import { Link } from "react-router"


const UserAppellation = ({user: {username, name}, withoutActions=false, compact=false}) => {
  const prettyUsername = `@${username}`
  const Component = withoutActions ? 'div' : Link
  const componentProps = withoutActions ? {} : {to: `/u/${username}`}

  if (compact)
    return (
      <Component {...componentProps} className="user-appellation" title={name}>
        {prettyUsername}
      </Component>
    )
  return (
    <Component {...componentProps} className="user-appellation">
      <strong className="main-appelation">{ name || prettyUsername }</strong>
      {name && <small className="secondary-appelation"> {prettyUsername}</small>}
    </Component>
  )
}

export default UserAppellation