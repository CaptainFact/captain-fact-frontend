import React from 'react'
import { withNamespaces, Trans } from 'react-i18next'
import { Link } from 'react-router'
import ReactPlayer from 'react-player'
import styled from 'styled-components'
import { Flex, Box } from '@rebass/grid'
import { PlusCircle } from 'styled-icons/boxicons-solid/PlusCircle'

import { registerClick } from '../../API/matomo'
import Button from '../Utils/Button'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

import chromeLogo from '../../assets/browsers/chrome.png'
import firefoxLogo from '../../assets/browsers/firefox.png'
import ieLogo from '../../assets/browsers/internet_explorer.png'
import demoExtensionVideo from '../../assets/demos/demo-extension.mp4'

const PresentationBox = styled(Box)`
  background: white;
  padding: 2.5em 2em;
  border-radius: 0.25em;
  box-shadow: -1px 7px 14px #9c9c9c;
  flex-basis: 475px;
`

const MainContainer = styled(Flex)`
  max-width: 1400px;
`

const Presentation = ({ t }) => (
  <p>
    {t('description')}{' '}
    <Trans i18nKey="moreInfo">
      [Is]
      <ExternalLinkNewTab href="https://github.com/CaptainFact">
        open-source
      </ExternalLinkNewTab>
      [Respect]<Link to="/help/extension">[Privacy]</Link>.
    </Trans>
  </p>
)

const BrowserExtensionInstall = ({ label, img, url, name, disabled = false }) => (
  <Flex mb="0.75em" flexWrap="wrap" justifyContent={['center', 'flex-start']}>
    <Box width="50px" flexBasis="50px" mx={['1em', '1.5em']}>
      <img src={img} alt={name} />
    </Box>
    <Box>
      <ExternalLinkNewTab
        href={url}
        onClick={() => registerClick('ExtensionPage', 'Button', `Install-${name}`)}
      >
        <Button style={{ width: '235px' }} className="is-large" disabled={disabled}>
          <PlusCircle size="1em" />
          &nbsp;&nbsp;{label}
        </Button>
      </ExternalLinkNewTab>
    </Box>
  </Flex>
)

export const BrowserExtensionsPage = withNamespaces('extension')(({ t }) => (
  <div className="browser-extension-page">
    <section className="hero is-gradient-primary is-medium is-bold">
      <section className="hero-body">
        <div className="container">
          <h1 className="title is-2">{t('title')}</h1>
          <h2 className="subtitle is-3">{t('subtitle')}</h2>
        </div>
      </section>
    </section>
    <MainContainer
      mt={['-3.5em', '-8em']}
      p="1em"
      flexWrap="wrap"
      mx="auto"
      alignItems="center"
      justifyContent="space-around"
    >
      <PresentationBox width={[1, 1, 0.4]} mr={['0em', '5em']} mb="2em" fontSize={4}>
        <Presentation t={t} />
        <br />
        <BrowserExtensionInstall
          img={chromeLogo}
          label={`${t('addTo')} Chrome`}
          url="https://chrome.google.com/webstore/detail/fnnhlmbnlbgomamcolcpgncflofhjckm"
          name="Chrome"
        />
        <BrowserExtensionInstall
          img={firefoxLogo}
          url="https://addons.mozilla.org/addon/captainfact/"
          label={`${t('addTo')} Firefox`}
          name="Firefox"
        />
        <BrowserExtensionInstall img={ieLogo} label="Just kidding" name="IE" disabled />
      </PresentationBox>
      <Box width={[1, 1, 0.4]} style={{ flexGrow: 1 }}>
        <ReactPlayer
          controls
          width="600px"
          height="338px"
          className="video"
          muted
          playing
          loop
          url={demoExtensionVideo}
        />
      </Box>
    </MainContainer>
  </div>
))
