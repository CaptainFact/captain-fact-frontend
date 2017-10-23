import React from "react"
import upperCase from "voca/upper_case"
// import trimRight from "voca/trim_right"


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

const getHostName = url =>
  upperCase(url.replace(/https?:\/\//, "").replace(/\/.*/g, ""))

export const Source = ({source: {url, title, site_name}}) => (
  <a href={url} target="_BLANK" className="fact-source">
    <span className="site-name">
      { upperCase(site_name) || getHostName(url) }
    </span>
    <span className="article-title">{title}</span>
  </a>
)
