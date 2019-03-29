import React from 'react'
import classNames from 'classnames'
import styled from 'styled-components'
import { space, flex } from 'styled-system'

const BaseButton = styled.button`
  ${space}
  ${flex}
`

/* eslint-disable react/button-has-type */

const Button = ({ className, type = 'button', ...props }) => (
  <BaseButton className={classNames('button', className)} type={type} {...props} />
)

export default Button
