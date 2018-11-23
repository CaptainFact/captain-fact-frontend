import React from 'react'
import { css } from 'emotion'
import { pxTo } from 'design-system-utils'
import { withTheme } from './../../smart/ThemeProvider'
import { ds } from './../../../styles/tokens'

const baseFontSize = ds.get("type.sizes.baseFontSize")
const buttonTheme = {
  outline: {
    colors: {
      tutorial: {
        light: ds.get('colors.midnightLightest'),
        dark: ds.get('colors.orangeRegular'),
      }
    },
  },
  colors: {
    tutorial: {
      light: ds.get('colors.midnightLightest'),
      dark: ds.get('colors.orangeMedium'),
    }
  },
  backgrounds: {
    tutorial: {
      dark: `linear-gradient(90deg, ${ds.get('colors.orangeRegular')} 0%, ${ds.get('colors.orangeLight')} 100%)`,
      light: `linear-gradient(90deg, ${ds.get('colors.cyanRegular')} 0%, ${ds.get('colors.lavenderRegular')} 100%)`,
    }
  },
}

const Button = (props) => {
  const { theme, size, additionalStyles, themeName, onClick, outline, radius, children } = props
  return <button onClick={onClick} className={css({
    background: outline === true ? 'transparent' : buttonTheme.backgrounds[themeName][theme],
    border: outline === true ? `solid ${pxTo(1, baseFontSize, "rem")} currentColor !important` : `0 !important`,
    color: outline === true ? buttonTheme.outline.colors[themeName][theme] : buttonTheme.colors[themeName][theme],
    borderRadius: ds.get(`radius.${radius}`),
    fontSize:  pxTo(ds.get(`type.sizes.${size}`), baseFontSize, "rem"),
  }).concat(' ', additionalStyles ? additionalStyles : '')}>
    {children}
  </button>
}


Button.defaultProps = {
  radius: 'default'
}
export default withTheme(Button)