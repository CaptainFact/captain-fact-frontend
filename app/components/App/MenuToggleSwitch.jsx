import PropTypes from 'prop-types'
import React from 'react'
import { Menu as MenuIcon, X as XIcon } from 'styled-icons/boxicons-regular'

import { useUserPreferences } from '../../contexts/UserPreferencesContext'

const MenuToggleSwitch = ({ toggleableIcon }) => {
  const { sidebarExpended, toggleSidebar } = useUserPreferences()
  return (
    <button
      onClick={() => toggleSidebar()}
      className="bg-none outline-none border-0 p-0 h-full w-[45px] cursor-pointer select-none text-[#4a4a4a] hover:text-[#252525]"
    >
      {sidebarExpended && toggleableIcon ? <XIcon /> : <MenuIcon />}
    </button>
  )
}

MenuToggleSwitch.propTypes = {
  toggleableIcon: PropTypes.bool.isRequired,
}

export default MenuToggleSwitch
