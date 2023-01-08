import classNames from 'classnames'
import React from 'react'
import styled from 'styled-components'
import { flex, space } from 'styled-system'

const BaseButton = styled.button`
  ${space}
  ${flex}
`

/* eslint-disable react/button-has-type */

const Button = ({ className, type = 'button', ...props }) => (
  <BaseButton className={classNames('button', className)} type={type} {...props} />
)

export default Button
