import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Menu as MenuIcon, X as XIcon } from 'styled-icons/boxicons-regular'

import { toggleSidebar } from '../../state/user_preferences/reducer'

const MenuToggleSwitch = ({ toggleSidebar, sidebarExpended, toggleableIcon }) => (
  <button
    onClick={() => toggleSidebar()}
    className="bg-none outline-none border-0 p-0 h-full w-[45px] cursor-pointer select-none text-[#4a4a4a] hover:text-[#252525]"
  >
    {sidebarExpended && toggleableIcon ? <XIcon /> : <MenuIcon />}
  </button>
)

MenuToggleSwitch.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  sidebarExpended: PropTypes.bool.isRequired,
  toggleableIcon: PropTypes.bool.isRequired,
}

export default connect(({ UserPreferences: { sidebarExpended } }) => ({ sidebarExpended }), {
  toggleSidebar,
})(MenuToggleSwitch)
