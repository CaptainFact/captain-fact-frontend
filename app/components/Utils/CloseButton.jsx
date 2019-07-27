import React from 'react'
import styled from 'styled-components'
import { TimesCircle } from 'styled-icons/fa-regular/TimesCircle.cjs'

const CloseButton = styled(({ size = '1em', ...props }) => (
  <TimesCircle size={size} cursor="pointer" title="Close" {...props} />
))`
  &:hover {
    opacity: 0.75;
  }
`

export default CloseButton
