import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import Icon from '../Icons/Icon';
import { Link } from 'react-router'

export default class MenuLink extends Component {

  render() {
    return ( 
      <Link to={`/new/${this.props.name}`} activeClassName="active">
        <Icon name={this.props.name}/>
        <span className='to-show'>{this.props.name}</span>
      </Link>
    )
  }
}