import React from 'react'

import logo from '../../assets/logo.svg'
import borderlessLogo from '../../assets/logo-borderless.svg'

/**
 * The main website logo.
 */
const Logo = ({ borderless = false }) => (
  <div className="flex items-center max-h-full font-serif font-medium text-black-500 tracking-wide text-black">
    <img
      alt="C"
      src={borderless ? borderlessLogo : logo}
      className="sm:h-[36px] sm:w-[36px] h-[32px] w-[32px]"
    />
    <span className="sm:text-xl md:text-lg text-base ml-[1px]">aptain</span>
    <span className="sm:text-xl md:text-lg text-base font-bold mr-4">Fact</span>
  </div>
)

export default Logo
