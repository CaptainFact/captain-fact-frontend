import { ExternalLink } from 'lucide-react'
import React from 'react'
import ReactPlayer from 'react-player'

import { youtubeRegex } from '../../lib/url_utils'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

const supportedPlayerUrls = [youtubeRegex]

/**
 * Returns displayable, uppercase host name
 * ex: https://www.toto.fr/titi/page.lol => TOTO.FR
 */
const getDisplayableHostname = (url) =>
  (url || '')
    .toUpperCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/.*/g, '')

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

export const Source = ({ source: { url, title, site_name }, withoutPlayer }) => {
  if (!withoutPlayer && isPlayer(url)) {
    return (
      <ReactPlayer
        className="mt-2 max-w-full rounded-lg shadow-lg"
        controls
        height={198}
        width={352}
        url={url}
        config={PLAYER_CONFIG}
      />
    )
  }
  return (
    <ExternalLinkNewTab
      href={url}
      className="inline-block max-w-full p-3 px-5 mt-2 text-sm border border-primary-600/20 border-l-4 border-l-blue-400 rounded-r-md shadow-sm transition-all duration-200 hover:shadow-md hover:translate-x-0.5 hover:bg-gradient-to-br hover:from-primary-700/90 hover:to-primary-800/90 group"
    >
      <div className="flex items-center gap-1 fond-semibold text-[1.05em] truncate group-hover:underline decoration-primary-400/60">
        <ExternalLink size="1em" />
        {site_name ? site_name.toUpperCase() : getDisplayableHostname(url)}
      </div>
      <span className="italic text-[0.95em]">{title}</span>
    </ExternalLinkNewTab>
  )
}
