import React from "react"
import { translate } from 'react-i18next'


const BrowserExtensionsPage = ({t}) => (
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
                            buttonLabel="Get on Chrome Web Store"
                            url="https://chrome.google.com/webstore/detail/captainfact-beta/fnnhlmbnlbgomamcolcpgncflofhjckm"/>
          <BrowserExtension browser="Mozilla Firefox" image="/assets/img/firefox.png"
                            buttonLabel="Download for Firefox (Coming soon)" disabled={true}
                            url="https://addons.mozilla.org/en-US/firefox/"/>
          <BrowserExtension browser="Internet Explorer" image="/assets/img/internet_explorer.png"
                            buttonLabel="Just kidding" disabled={true}
                            url="https://www.mozilla.org/fr/firefox/new/"/>
        </div>
      </div>
    </section>
  </div>
)

const BrowserExtension = ({browser, image, buttonLabel, url, disabled=false}) => (
  <div className="column has-text-centered">
    <a href={url} target="_BLANK" className={disabled && "is-disabled"}>
      <img src={image} alt={browser}/>
      <span className={"button is-large" + (disabled ? " is-disabled" : "")} style={{display: "flex"}}>
        {buttonLabel}
      </span>
    </a>
  </div>
)

export default translate('main')(BrowserExtensionsPage)