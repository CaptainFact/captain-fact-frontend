import React from "react"
import ReactPlayer from "react-player"
import upperCase from "voca/upper_case"
import { dailymotionRegex, soundcloudRegex, youtubeRegex } from '../../lib/url_utils'


const supportedPlayerUrls = [youtubeRegex, dailymotionRegex, soundcloudRegex]


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
    return <ReactPlayer  className="video" controls={true} height={180} width={320} url={url}
                         youtubeConfig={{playerVars: { showinfo: 1 }}}
    />
  } else {
    return <a href={url} target="_BLANK" className="fact-source">
      <span className="site-name">
        {upperCase(site_name) || getDisplayableHostname(url)}
      </span>
      <span className="article-title">{title}</span>
    </a>
  }
}
