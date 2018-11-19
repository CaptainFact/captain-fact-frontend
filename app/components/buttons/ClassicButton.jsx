import React from 'react'
import { Link } from 'react-router'

const ClassicButton = props => {
  if (props.icon && props.text && props.href) {
    return (
      <a className="classic-button upper flex flex-center" target="_blank" href={props.href}>
        <img src={props.icon}/>
        <span>{props.text}</span>
      </a>
    )
  }
  else if (props.icon) {
    return (
      <Link className="classic-button upper flex flex-center" to={props.link}>
        <img src={props.icon}/>
      </Link>
    )
  } else if (!props.icon) {
    return (
      <Link className="classic-button upper" to={props.link}>{props.text}</Link>
    )
  }
}

export default ClassicButton