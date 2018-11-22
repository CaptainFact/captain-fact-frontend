import React from 'react'
import { css } from 'emotion'
import { withTheme } from './../../smart/ThemeProvider'

const colors = {
  dark: 'text-cyanRegular',
  light: 'text-orangeRegular',
}

const Anchor = (props) => <a {...props} /> // fallback component if none is provided

const Link = ({ path, component, staticStyles, theme, underline, ...props }) => {
  const NavLink = component || Anchor
  return <NavLink
    className={`${underline === true ? 'underline hover:no-underline' : 'no-underline' } ${colors[theme]} hover:${colors[theme]} ${staticStyles ? staticStyles : ''}`}
    {...props}
  />
}

Link.defaultProps = {
  underline : true,
}
export default withTheme(Link)