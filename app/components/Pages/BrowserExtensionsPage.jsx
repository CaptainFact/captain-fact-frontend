import React from 'react'
import { translate, Trans } from 'react-i18next'
import { Link } from 'react-router'
import ReactPlayer from 'react-player'
import Icon from '../Utils/Icon'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'


export const BrowserExtensionsPage = translate('extension')(({t}) => (
  <div className="browser-extension-page">
    <section className="section">
      <div className="columns">
        <BrowserExtension
          browser="Google Chrome"
          image="/assets/img/chrome.png"
          buttonLabel={`${t('addTo')} Chrome`}
          onClick={chromeInstall}
          url="https://chrome.google.com/webstore/detail/fnnhlmbnlbgomamcolcpgncflofhjckm"
        />
        <BrowserExtension
          browser="Mozilla Firefox"
          image="/assets/img/firefox.png"
          buttonLabel={`${t('addTo')} Firefox`}
          url="https://addons.mozilla.org/addon/captainfact/"
        />
        <BrowserExtension
          browser="Internet Explorer"
          image="/assets/img/internet_explorer.png"
          buttonLabel="Just kidding"
          disabled
          url="https://www.mozilla.org/fr/firefox/"
        />
      </div>
    </section>
    <section className="section content has-text-centered box">
      <h2>
        {t('description')}
        <br/><br/>
        <Trans i18nKey="moreInfo">
          [Is]<ExternalLinkNewTab href="https://github.com/CaptainFact/captain-fact-extension">open-source</ExternalLinkNewTab>
          [Respect]<Link to="/help/extension">[Privacy]</Link>.
        </Trans>
      </h2>
    </section>
    <section className="has-text-centered section">
      <ReactPlayer
        controls
        className="video"
        url="https://youtu.be/k4L0fvwsBg0"
      />
    </section>
  </div>
))

const BrowserExtension = ({browser, image, buttonLabel, url, onClick, disabled = false}) => (
  <div className="column">
    <ExternalLinkNewTab href={url} onClick={onClick} disabled={disabled}>
      <figure className="image is-128x128">
        <img src={image} alt={browser}/>
      </figure>
      <span className="button is-large is-info is-inverted" disabled={disabled}>
        <Icon name="plus"/>
        <span>{buttonLabel}</span>
      </span>
    </ExternalLinkNewTab>
  </div>
)

function chromeInstall(e) {
  if (typeof chrome !== 'undefined') {
    // eslint-disable-next-line no-undef
    chrome.webstore.install('https://chrome.google.com/webstore/detail/fnnhlmbnlbgomamcolcpgncflofhjckm')
    e.preventDefault()
    return false
  }
}
