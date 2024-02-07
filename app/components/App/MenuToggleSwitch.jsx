import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styled, { withTheme } from 'styled-components'
import { Menu as MenuIcon } from 'styled-icons/boxicons-regular'
import { X as XIcon } from 'styled-icons/boxicons-regular'
import { themeGet } from 'styled-system'

import { toggleSidebar } from '../../state/user_preferences/reducer'

const Button = styled.button`
  background: none;
  outline: none;
  border: 0;
  padding: 0;
  height: 100%;
  width: 45px;
  cursor: pointer;
  user-select: none;
  color: ${themeGet('colors.black.400')};

  &:hover {
    color: ${themeGet('colors.black.500')};
  }
`

const MenuToggleSwitch = ({ toggleSidebar, sidebarExpended, toggleableIcon }) => (
  <Button onClick={() => toggleSidebar()}>
    {sidebarExpended && toggleableIcon ? <XIcon /> : <MenuIcon />}
  </Button>
)

MenuToggleSwitch.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  sidebarExpended: PropTypes.bool.isRequired,
  toggleableIcon: PropTypes.bool.isRequired,
}

export default withTheme(
  connect(({ UserPreferences: { sidebarExpended } }) => ({ sidebarExpended }), { toggleSidebar })(
    MenuToggleSwitch,
  ),
)
