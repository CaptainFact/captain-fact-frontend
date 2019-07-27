import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Flex, Box } from '@rebass/grid'
import { withNamespaces } from 'react-i18next'

import { PuzzlePiece } from 'styled-icons/fa-solid/PuzzlePiece'

import StyledCard from '../Utils/StyledCard'
import { P } from '../StyledUtils/Text'
import { ChromeExtensionBtn, FirefoxExtensionBtn } from './InstallButtons'
import Container from '../StyledUtils/Container'
import CloseButton from '../Utils/CloseButton'

const ExtensionAd = ({ t }) => {
  return (
    <StyledCard
      display={['none', null, 'block']}
      position="fixed"
      width="100%"
      maxWidth={600}
      bg="#6ba3a7"
      color="white"
      p={3}
      ml={36}
      css={{ left: 36, bottom: 36, zIndex: 99999 }}
    >
      <Container position="relative">
        <Container position="absolute" style={{ right: 0 }}>
          <CloseButton size={24} />
        </Container>
        <Container position="absolute" style={{ right: 10, top: 38, zIndex: 0 }}>
          <PuzzlePiece size={52} color="#94bdc0" />
        </Container>
        <P fontSize={3} mb={2}>
          {t('ad.title')}
        </P>
        <P fontSize={4} width="84%">
          {t('ad.description')}
        </P>
        <P>
          <Link to="/extension">{t('ad.moreInfo')}</Link>
        </P>
        <Flex flexWrap="wrap">
          <Box mr={3}>
            <ChromeExtensionBtn />
          </Box>
          <Box>
            <FirefoxExtensionBtn />
          </Box>
        </Flex>
      </Container>
    </StyledCard>
  )
}

ExtensionAd.propTypes = {
  /** @ignore from withNamespaces */
  t: PropTypes.func.isRequired
}

export default withNamespaces('extension')(ExtensionAd)
