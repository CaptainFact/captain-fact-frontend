import React from 'react'
import ReactPlayer from 'react-player'
import upperCase from 'voca/upper_case'
import { youtubeRegex } from '../../lib/url_utils'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

const supportedPlayerUrls = [youtubeRegex]

/**
 * Returns displayable, uppercase host name
 * ex: https://www.toto.fr/titi/page.lol => TOTO.FR
 */
const getDisplayableHostname = url =>
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
const isPlayer = url => {
  for (const playerRegex of supportedPlayerUrls) {
    if (playerRegex.test(url)) return true
  }
  return false
}

const PLAYER_CONFIG = { youtube: { playerVars: { showinfo: 1 } } }

export const Source = ({ source: { url, title, site_name }, withoutPlayer }) => {
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
  return (
    <div className="source-container">
      <ExternalLinkNewTab href={url} className="source">
        <span className="site-name">
          {upperCase(site_name) || getDisplayableHostname(url)}
        </span>
        <span className="article-title">{title}</span>
      </ExternalLinkNewTab>
    </div>
  )
}
