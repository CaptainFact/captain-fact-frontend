import React from 'react'
import { Trans, withTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import { PlusCircle } from 'styled-icons/boxicons-solid'

import chromeLogo from '../../assets/browsers/chrome.png'
import firefoxLogo from '../../assets/browsers/firefox.png'
import ieLogo from '../../assets/browsers/internet_explorer.png'
import demoExtensionVideo from '../../assets/demos/demo-extension.mp4'
import { Button } from '../ui/button'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

const Presentation = ({ t }) => (
  <p>
    {t('description')}{' '}
    <Trans i18nKey="extension:moreInfo">
      [Is]
      <ExternalLinkNewTab href="https://github.com/CaptainFact">open-source</ExternalLinkNewTab>
      [Respect]<Link to="/help/extension">[Privacy]</Link>.
    </Trans>
  </p>
)

const BrowserExtensionInstall = ({ isPrimary, label, img, url, name, disabled = false }) => (
  <div className="flex flex-wrap mb-4 justify-start items-center">
    <div className="w-[40px] sm:w-[50px] mr-4 sm:mr-6 flex-shrink-0">
      <img src={img} alt={name} />
    </div>
    <ExternalLinkNewTab href={url} className="flex-1">
      <Button
        variant={isPrimary ? 'default' : 'outline'}
        disabled={disabled}
        size="lg"
        className="w-full text-sm sm:text-base"
      >
        <PlusCircle size="1em" />
        <span className="ml-2">{label}</span>
      </Button>
    </ExternalLinkNewTab>
  </div>
)

const getBrowserType = () => {
  const ua = navigator.userAgent
  if (ua.indexOf('Chrome') !== -1) {
    return 'Chrome'
  } else if (ua.indexOf('Firefox') !== -1) {
    return 'Firefox'
  } else if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident') !== -1) {
    return 'IE'
  }
  return 'Unknown'
}

export const BrowserExtensionsPage = withTranslation('extension')(({ t }) => {
  const browserType = getBrowserType()
  return (
    <div>
      <section className="bg-gradient-to-tr from-primary to-primary/90 py-16 sm:py-24 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('title')}</h1>
          <h2 className="text-2xl sm:text-3xl">{t('subtitle')}</h2>
        </div>
      </section>
      <section>
        <div className="container -mt-12 sm:-mt-20 p-4 flex gap-6 mx-auto justify-between items-center md:flex-row flex-col-reverse">
          <div className="w-full max-w-[500px] bg-white p-6 sm:p-10 rounded shadow-lg text-base sm:text-lg">
            <Presentation t={t} />
            <br />
            <BrowserExtensionInstall
              img={chromeLogo}
              label={`${t('addTo')} Chrome`}
              url="https://chrome.google.com/webstore/detail/fnnhlmbnlbgomamcolcpgncflofhjckm"
              name="Chrome"
              isPrimary={browserType === 'Chrome'}
            />
            <BrowserExtensionInstall
              img={firefoxLogo}
              url="https://addons.mozilla.org/addon/captainfact/"
              label={`${t('addTo')} Firefox`}
              name="Firefox"
              isPrimary={browserType === 'Firefox'}
            />
            <BrowserExtensionInstall img={ieLogo} label="Just kidding" name="IE" disabled />
          </div>
          <ReactPlayer
            controls
            width="100%"
            height="auto"
            className="shadow-lg rounded-lg overflow-hidden max-w-[690px] aspect-video"
            muted
            playing
            loop
            url={demoExtensionVideo}
          />
        </div>
      </section>
    </div>
  )
})
