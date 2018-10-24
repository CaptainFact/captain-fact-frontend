import React from 'react'

import logo from '../../assets/logo.svg'
import borderlessLogo from '../../assets/logo-borderless.svg'

const Logo = ({ borderless = false }) => (
  <h1 className="site-logo title is-1">
    <img alt="C" src={borderless ? borderlessLogo : logo} />
    <span className="logo-captain">aptain</span>
    <span className="logo-fact">Fact</span>
    <small className="beta"> (Beta)</small>
  </h1>
)

export default Logo
