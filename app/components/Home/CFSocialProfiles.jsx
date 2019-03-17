import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from '@rebass/grid'
import styled, { withTheme } from 'styled-components'
import { get } from 'lodash'

import { Discord } from 'styled-icons/fa-brands/Discord'
import { Facebook } from 'styled-icons/fa-brands/Facebook'
import { Twitter } from 'styled-icons/fa-brands/Twitter'
import { Github } from 'styled-icons/fa-brands/Github'

import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

const IconLinkContainer = styled(ExternalLinkNewTab)`
  margin: 0 0.5em;
`

/**
 * Render a social icon with the proper link and add a popup with the title
 * of the social network.
 */
const SocialIconLink = ({ Icon, name, url, size, color }) => {
  return (
    <IconLinkContainer title={name} href={url}>
      <Icon size={size} color={color} />
    </IconLinkContainer>
  )
}

/**
 * Render social profiles icons for other CaptainFact profiles on
 * Facebook, Twitter...
 */
const CFSocialProfiles = ({ size, color, justifyContent, theme }) => {
  const themeColor = get(theme, `colors.${color}`, color)
  return (
    <Flex justifyContent={justifyContent} style={{ height: size + 2 }}>
      <SocialIconLink
        name="Discord"
        Icon={Discord}
        size={size}
        url="https://discord.gg/2Qd7hMz"
        color={themeColor}
      />
      <SocialIconLink
        name="Github"
        Icon={Github}
        size={size}
        url="https://github.com/CaptainFact"
        color={themeColor}
      />
      <SocialIconLink
        name="Twitter"
        Icon={Twitter}
        size={size}
        url="https://twitter.com/CaptainFact_io"
        color={themeColor}
      />
      <SocialIconLink
        name="Facebook"
        Icon={Facebook}
        size={size}
        url="https://www.facebook.com/CaptainFact.io"
        color={themeColor}
      />
    </Flex>
  )
}

CFSocialProfiles.propTypes = {
  /** Icons size. Default to 2em */
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Passed to Flex */
  justifyContent: PropTypes.string
}

CFSocialProfiles.defaultProps = {
  size: '2em',
  justifyContent: 'center'
}

export default withTheme(CFSocialProfiles)
