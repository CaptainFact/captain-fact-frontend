import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { themeGet } from 'styled-system'

import { Flex } from '@rebass/grid'
import logo from '../../assets/logo.svg'
import borderlessLogo from '../../assets/logo-borderless.svg'
import { Span, Small } from '../StyledUtils/Text'

const LogoContainer = styled(Flex)`
  max-height: 100%;
  align-items: center;
  font-family: ${themeGet('fontFamily.serif')};
  color: ${themeGet('colors.black.500')};

  ${props => css`
    font-size: ${props.size / 2}px;
    height: ${props.size}px;
  `}
`

const Image = styled.img`
  height: 100%;
  width: ${props => props.size}px;
`

/**
 * The main website logo.
 */
const Logo = ({ borderless, height }) => (
  <LogoContainer size={height}>
    <Image alt="C" src={borderless ? borderlessLogo : logo} />
    <Span ml="1px">aptain</Span>
    <Span fontWeight="bold" mr={1}>
      Fact
    </Span>
    <Small display={['none', 'block']} color="black.300" fontSize="0.6em" pb="0.2em">
      (Beta)
    </Small>
  </LogoContainer>
)

Logo.propTypes = {
  /** If true, a version of the logo without border will be used */
  borderless: PropTypes.bool,
  /** Base height of the component in pixels */
  height: PropTypes.number
}

Logo.defaultProps = {
  borderless: false,
  height: 30
}

export default Logo
