import React, { Component } from 'react'

export default class Icon extends Component {
  state = {

  };

  render() {
    return ( 
      <svg className={`i icon-${this.props.name}`}>
        <use xlinkHref={`#icon-${this.props.name}`}></use>
      </svg>
    )
  }
}