import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { themeGet } from 'styled-system'
import { Box } from '@rebass/grid'

import { BellSlash } from 'styled-icons/fa-solid/BellSlash'
import { Bell } from 'styled-icons/fa-solid/Bell'

const SubscribeIconContainer = styled(Box)`
  width: 1em;
  height: 1em;
  transform: rotateY(${props => (props.isSubscribed ? 180 : 0)}deg);
  transition: transform 0.3s;
  transform-style: preserve-3d;
  svg {
    position: absolute;
    width: 1em;
    height: 1em;
    border: 1px solid;
    border-radius: 1em;
    transition: opacity 0.3s, color 0.3s;
    backface-visibility: hidden;
  }

  ${props => props.onClick
    && css`
      cursor: pointer;
    `}
`

const IconSubscribed = styled(Bell)`
  color: ${themeGet('colors.yellow')};
  transform: rotateY(180deg);
  padding: 0.25em;
  &:hover {
    opacity: 0.7;
  }
`

const IconUnsubscribed = styled(BellSlash)`
  color: ${themeGet('colors.black.300')};
  opacity: 0.7;
  padding: 0.2em;
  &:hover {
    color: #e2b26f;
    opacity: 0.7;
  }
`

const SubscribeBtn = ({ size, isSubscribed, onChange, ...props }) => (
  <Box fontSize={size} {...props}>
    <SubscribeIconContainer
      isSubscribed={isSubscribed}
      onClick={onChange && (() => onChange(!isSubscribed))}
    >
      <IconSubscribed />
      <IconUnsubscribed />
    </SubscribeIconContainer>
  </Box>
)

SubscribeBtn.propTypes = {
  /** Current state (subscribed or unsubscribed) */
  isSubscribed: PropTypes.bool.isRequired,
  /** A function called with new subscription state when button is clicked */
  onChange: PropTypes.func,
  /** Icon size */
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Any props from `Box` */
  ...Box.propTypes
}

SubscribeBtn.defaultProps = {
  size: '1em'
}

export default SubscribeBtn
