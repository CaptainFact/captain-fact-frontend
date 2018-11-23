import React, { Component } from 'react'
import PropTypes from 'prop-types';

const Icon = ({name}) => {
  return ( 
    <svg className={`i icon-${name}`}>
      <use xlinkHref={`#icon-${name}`}></use>
    </svg>
  )
}

Icon.propTypes = {
  name: PropTypes.string.isRequired
};

export default Icon;