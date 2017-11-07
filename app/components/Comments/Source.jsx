import React from "react"
import ReactPlayer from "react-player"
import upperCase from "voca/upper_case"
import lowerCase from "voca/lower_case"

// const truncateUrl = (url, maxLength) => {
//   if (url.length >= maxLength) {
//     url = trimRight(url, '/')
//     const regex = /(http:\/\/|https:\/\/)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig
//     const urlParts = regex.exec(url)
//     if (urlParts) {
//       const afterSlash = urlParts[3].split('/')
//       url = `${urlParts[2]}/.../${afterSlash[afterSlash.length - 1]}`
//     }
//   }
//   return url.replace(/https?:\/\//, "")
// }

const supportedPlayers = ['youtube', 'dailymotion', 'twitch', 'soundcloud', 'streamable', 'vidme', 'vimeo', 'wistia']

const getHostName = url =>
  upperCase(url.replace(/https?:\/\//, "").replace(/\/.*/g, ""))

const isPlayer = site_name => supportedPlayers.includes(lowerCase(site_name))

export const Source = ({ source: { url, title, site_name }, withoutPlayer }) => {
  if (isPlayer(site_name) && !withoutPlayer) {
    return (<ReactPlayer width='100%' url={url} config={{
      youtube: { preload: false },
      facebook: { preload: false },
      dailymotion: { preload: false },
      soundcloud: { preload: false }
    }} />)
  } else {
    return <a href={url} target="_BLANK" className="fact-source">
      <span className="site-name">
        {upperCase(site_name) || getHostName(url)}
      </span>
      <span className="article-title">{title}</span>
    </a>
  }
}
