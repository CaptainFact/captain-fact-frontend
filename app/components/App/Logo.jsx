import React from 'react'

const LOGO = '/assets/img/logo.svg'
const BORDERLESS_LOGO = '/assets/img/logo-borderless.svg'

const Logo = ({borderless = false}) => (
  <h1 className="site-logo title is-1">
    <img alt="C" src={borderless ? BORDERLESS_LOGO : LOGO}/>
    <span className="logo-captain">aptain</span>
    <span className="logo-fact">Fact</span>
    <small className="beta"> (Beta)</small>
  </h1>
)

export default Logo
