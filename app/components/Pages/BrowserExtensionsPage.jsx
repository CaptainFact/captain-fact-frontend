import React from "react"
import { translate } from 'react-i18next'
import classNames from 'classnames'


export const BrowserExtensionsPage = translate('main')(({t}) => (
  <div className="browser-extension-page">
    <section className="hero is-info">
      <div className="hero-body">
        <div className="container">
          <h1 className="title is-1">{ t('menu.extension') }</h1>
        </div>
      </div>
    </section>
    <section className="section">
      <div className="container">
        <div className="columns">
          <BrowserExtension browser="Google Chrome" image="/assets/img/chrome.png"
                            buttonLabel="Add to Chrome"
                            onClick={chromeInstall}
                            url="https://chrome.google.com/webstore/detail/fnnhlmbnlbgomamcolcpgncflofhjckm"/>
          <BrowserExtension browser="Mozilla Firefox" image="/assets/img/firefox.png"
                            buttonLabel="Add to Firefox"
                            url="https://addons.mozilla.org/addon/captainfact/"/>
          <BrowserExtension browser="Internet Explorer" image="/assets/img/internet_explorer.png"
                            buttonLabel="Just kidding" disabled={true}
                            url="https://www.mozilla.org/fr/firefox/"/>
        </div>
      </div>
    </section>
  </div>
))

const BrowserExtension = ({browser, image, buttonLabel, url, onClick, disabled=false}) => (
  <div className="column">
    <a href={url} onClick={onClick} target="_BLANK" className={classNames({'is-disabled': disabled})}>
      <figure className="image is-128x128" style={{margin: '0 auto'}}>
        <img src={image} alt={browser}/>
      </figure>
      <span className={"button is-large" + (disabled ? " is-disabled" : "")} style={{display: "flex"}}>
        {buttonLabel}
      </span>
    </a>
  </div>
)

function chromeInstall(e) {
  if (typeof chrome !== 'undefined') {
    chrome.webstore.install(null)
    e.preventDefault()
    return false
  }
}