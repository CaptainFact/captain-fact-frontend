import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from '@rebass/grid'
import styled from 'styled-components'

import { Discord } from 'styled-icons/fa-brands/Discord'
import { Facebook } from 'styled-icons/fa-brands/Facebook'
import { Twitter } from 'styled-icons/fa-brands/Twitter'
import { Github } from 'styled-icons/fa-brands/Github'

import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

const IconLinkContainer = styled(ExternalLinkNewTab)`
  color: white;
  margin: 0 0.5em;
`

/**
 * Render a social icon with the proper link and add a popup with the title
 * of the social network.
 */
const SocialIconLink = ({ Icon, name, url, size }) => {
  return (
    <IconLinkContainer title={name} href={url}>
      <Icon size={size} />
    </IconLinkContainer>
  )
}

/**
 * Render social profiles icons for other CaptainFact profiles on
 * Facebook, Twitter...
 */
const CFSocialProfiles = ({ size = '2em' }) => {
  return (
    <Flex justifyContent="center" style={{ height: size }}>
      <SocialIconLink
        name="Discord"
        Icon={Discord}
        size={size}
        url="https://discord.gg/2Qd7hMz"
      />
      <SocialIconLink
        name="Github"
        Icon={Github}
        size={size}
        url="https://github.com/CaptainFact"
      />
      <SocialIconLink
        name="Twitter"
        Icon={Twitter}
        size={size}
        url="https://twitter.com/CaptainFact_io"
      />
      <SocialIconLink
        name="Facebook"
        Icon={Facebook}
        size={size}
        url="https://www.facebook.com/CaptainFact.io"
      />
    </Flex>
  )
}

CFSocialProfiles.propTypes = {
  /** Icons size. Default to 2em */
  size: PropTypes.string
}

export default CFSocialProfiles
