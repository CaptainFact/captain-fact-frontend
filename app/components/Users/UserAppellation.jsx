import React from "react"
import { Link } from "react-router"


const UserAppellation = ({user: {username, name}, withoutActions=false}) => {
  const prettyUsername = `@${username}`
  const Component = withoutActions ? 'div' : Link
  const componentProps = withoutActions ? {} : {to: `/u/${username}`}
  return (
    <Component {...componentProps} className="user-appellation">
      <strong className="main-appelation">{ name || prettyUsername }</strong>
      {name && <small className="secondary-appelation"> {prettyUsername}</small>}
    </Component>
  )
}

export default UserAppellation