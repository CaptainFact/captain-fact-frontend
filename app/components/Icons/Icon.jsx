import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default Icon = ({name}) => {
  return ( 
    <svg className={`i icon-${name}`}>
      <use xlinkHref={`#icon-${name}`}></use>
    </svg>
  )
}

Icon.propTypes = {
  name: PropTypes.string.isRequired
};