import React from "react"
import ReactPlayer from "react-player"
import upperCase from "voca/upper_case"
import { youtubeRegex } from '../../lib/url_utils'


const supportedPlayerUrls = [youtubeRegex]


/**
 * Returns displayable, uppercase host name
 * ex: https://www.toto.fr/titi/page.lol => TOTO.FR
 */
const getDisplayableHostname = url =>
  upperCase(url.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/.*/g, ""))

/**
 * Check if we want to render medias from that website into players using `supportedPlayerUrls`
 */
const isPlayer = url => {
  for (let playerRegex of supportedPlayerUrls) {
    if (playerRegex.test(url))
      return true
  }
  return false
}

export const Source = ({ source: { url, title, site_name }, withoutPlayer }) => {
  if (!withoutPlayer && isPlayer(url)) {
    return <ReactPlayer  className="video" controls={true} height={198} width={352} url={url}
                         config={{youtube: {playerVars: { showinfo: 1, fs: 0 }}}}/>
  } else {
    return (
      <div>
        <a href={url} target="_BLANK" className="fact-source">
          <span className="site-name">
            {upperCase(site_name) || getDisplayableHostname(url)}
          </span>
          <span className="article-title">{title}</span>
        </a>
      </div>
    )
  }
}
