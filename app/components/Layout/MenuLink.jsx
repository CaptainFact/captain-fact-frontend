import React from 'react'
import Icon from '../Icons/Icon';
import { Link } from 'react-router'
import PropTypes from 'prop-types';

const MenuLink= ({name}) => {
  return ( 
    <Link to={`/new/${name}`} activeClassName="active">
      <Icon name={name}/>
      <span className='to-show'>{name}</span>
    </Link>
  )
}

MenuLink.propTypes = {
  name: PropTypes.string.isRequired
};

export default MenuLink;