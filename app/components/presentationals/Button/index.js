import React from 'react'
import { css } from 'emotion'
import { pxTo } from 'design-system-utils'
import PropTypes from 'prop-types'
import { ds } from "./../../../styles/tokens"

console.log(ds.get('colors.cyanRegular'))

const backgrounds = {
  primary: 'bg-cyanRegular',
  secondary: 'bg-purpleLight',
  tertiary: 'bg-orangeLight',
  quaternary: 'bg-midnightRegular',
}
const Button = ({theme, ...props}) => {

  return <button className={`${backgrounds[theme]}`} {...props}>
    { props.children }
  </button>
}

Button.defaultProps = {
  theme: 'primary',
}

export default Button