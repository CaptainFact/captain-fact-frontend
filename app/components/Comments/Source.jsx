import React from 'react'
import { connect } from 'react-redux'
import { addModal } from '../../state/modals/reducer'
import ReactPlayer from 'react-player'
import upperCase from 'voca/upper_case'
import { youtubeRegex } from '../../lib/url_utils'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import ModalSource from './ModalSource'

const supportedPlayerUrls = [youtubeRegex]

/**
 * Returns displayable, uppercase host name
 * ex: https://www.toto.fr/titi/page.lol => TOTO.FR
 */
const getDisplayableHostname = (url) =>
  upperCase(
    url
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/\/.*/g, '')
  )

/**
 * Check if we want to render medias from that website into players
 * using `supportedPlayerUrls`.
 */
const isPlayer = (url) => {
  for (const playerRegex of supportedPlayerUrls) {
    if (playerRegex.test(url)) {
      return true
    }
  }
  return false
}

const PLAYER_CONFIG = { youtube: { playerVars: { showinfo: 1 } } }

const handleSourceClick = (e, addModal, source) => {
  e.preventDefault()
  addModal({
    Modal: ModalSource,
    props: {
      source,
    },
  })
}

const Source = ({
  source: { url, title, site_name },
  withoutPlayer,
  withoutModalSource,
  addModal,
}) => {
  if (!withoutPlayer && isPlayer(url)) {
    return (
      <ReactPlayer
        className="video"
        controls
        height={198}
        width={352}
        url={url}
        config={PLAYER_CONFIG}
      />
    )
  }

  const website_name = upperCase(site_name) || getDisplayableHostname(url)

  return (
    <div className="source-container">
      <ExternalLinkNewTab
        href={url}
        className="source"
        onClick={(e) =>
          withoutModalSource ? null : handleSourceClick(e, addModal, { url, title, website_name })
        }
      >
        <span className="site-name">{website_name}</span>
        <span className="article-title">{title}</span>
      </ExternalLinkNewTab>
    </div>
  )
}

export default connect(null, { addModal })(Source)
