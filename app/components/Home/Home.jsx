import React from 'react'
import { Link } from 'react-router'
import { withNamespaces, Trans } from 'react-i18next'
import { ExternalLinkAlt } from 'styled-icons/fa-solid'

import * as Matomo from '../../API/matomo'
import { Icon } from '../Utils'
import { LOCAL_STORAGE_KEYS } from '../../lib/local_storage'
import DismissableMessage from '../Utils/DismissableMessage'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import CFSocialProfiles from './CFSocialProfiles'
import LastVideos from './LastVideos'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import imgExample1 from '../../assets/example1.jpg'
import examplesImg1 from '../../assets/examples/image-1.jpg'
import examplesImg2 from '../../assets/examples/image-2.jpg'
import examplesImg3 from '../../assets/examples/image-3.jpg'
import Container from '../StyledUtils/Container'

@withNamespaces('home')
@withLoggedInUser
export default class Home extends React.PureComponent {
  render() {
    const { t } = this.props

    return (
      <div className="home-page is-gradient-primary">
        <section className="hero">
          <div className="hero-body">
            <div className="columns is-desktop">
              <div className="column is-7-desktop">
                <h1 className="title1">
                  Captain
                  <strong>
                    <u>Fact</u>.
                  </strong>
                </h1>
                <br />
                <h2 className="title">{t('titleCF')}</h2>
                <h2 className="title light-title">
                  <Trans i18nKey="presentationTitle">
                    To train a critical mind, improve the quality of information and
                    decision-making.
                    <br />
                    Against fake news, fraud and disinformation
                  </Trans>
                </h2>
                <p className="presentation is-italic">{t('presentation')}</p>
                <div className="columns">
                  <div className="column is-5">
                    <p className="presentation is-bold">{t('presentationTextButton1')}</p>
                    <p>
                      <Link
                        onClick={() => Matomo.registerClick('Home', 'Button', 'ExtensionPage')}
                        className="button is-primary is-medium"
                        to="/extension"
                      >
                        {t('installExtension')}
                      </Link>
                    </p>
                  </div>
                  <div className="column is-5">
                    <p className="presentation is-bold">{t('presentationTextButton2')}</p>
                    <p>
                      <Link
                        onClick={() => Matomo.registerClick('Home', 'Button', 'SignUp')}
                        className="button is-secondary is-medium"
                        to="/signup"
                      >
                        {t('registerAndFactCheck')}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <div className="top-video column is-5-desktop is-flex">
                <div className="responsive-video-container">
                  <iframe
                    className="responsive-youtube-video"
                    width="100%"
                    height="auto"
                    src={
                      this.props.lng === 'fr'
                        ? 'https://www.youtube.com/embed/Hox_CHmC-so'
                        : 'https://www.youtube.com/embed/cZn72yBtIFw'
                    }
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {this.props.lng === 'fr' && (
          <section className="section know-more-fr has-text-centered">
            <p className="has-text-weight-semibold">
              {t('knowMoreFR')}
              <br />
              <ExternalLinkNewTab href="https://fr.captainfact.io/#partenariat" rel="nofollow">
                Partenariats
              </ExternalLinkNewTab>{' '}
              –{' '}
              <ExternalLinkNewTab href="https://fr.captainfact.io/#actions" rel="nofollow">
                Actions
              </ExternalLinkNewTab>{' '}
              –{' '}
              <ExternalLinkNewTab
                href="https://fr.captainfact.io/presentation-du-journal-du-fact-checking-collaboratif"
                rel="nofollow"
              >
                Journal
              </ExternalLinkNewTab>{' '}
              –{' '}
              <ExternalLinkNewTab href="https://fr.captainfact.io/forum-captainfact" rel="nofollow">
                Forum
              </ExternalLinkNewTab>{' '}
              –{' '}
              <ExternalLinkNewTab href="https://fr.captainfact.io/#participer" rel="nofollow">
                Donateurs
              </ExternalLinkNewTab>{' '}
              –{' '}
              <ExternalLinkNewTab href="https://discord.gg/Z22Vhda" rel="nofollow">
                Discord
              </ExternalLinkNewTab>{' '}
              –{' '}
              <ExternalLinkNewTab href="https://fr.captainfact.io/equipe" rel="nofollow">
                Équipe
              </ExternalLinkNewTab>
              <br />
              <ExternalLinkNewTab
                className="button is-primary is-large"
                href="https://fr.captainfact.io"
              >
                {t('goToFRSite')}
              </ExternalLinkNewTab>
            </p>
          </section>
        )}

        <section className="section last-videos" style={{ paddingBottom: '3em' }}>
          <div className="has-text-centered">
            <h2 className="title is-3">{t('latest')}</h2>
            <Link
              onClick={() => Matomo.registerClick('Home', 'Button', 'SeeAllVideos')}
              className="button animated-hover is-medium is-gradient-primary-light"
              to="/videos"
            >
              {t('seeVideos')}
            </Link>
          </div>
          <br />
          <br />
          <div className="last-videos-cards">
            <LastVideos />
          </div>
        </section>

        {this.props.lng === 'fr' && (
          <section className="subscribe-french-news">
            <DismissableMessage
              header={t('subscribeFrenchNews')}
              localStorageDismissKey={LOCAL_STORAGE_KEYS.DISMISS_FRENCH_NEWS_SUBSCRIPTION}
            >
              <iframe
                className="french-news-iframe"
                src="https://fr.captainfact.io/iframe-accueil"
              />
            </DismissableMessage>
          </section>
        )}

        <section className="section section-alt-bg has-text-centered">
          <h2 className="title-alt">
            <strong>{t('headerPunchline')}</strong>
            <br />
            {t('headerPunchline2')}
          </h2>
        </section>

        <section className="section hero has-background-white">
          <div className="hero-body how">
            <div className="columns">
              <div className="column is-6 presentation content">
                <br />
                <br />
                <h2 className="title is-3">{t('howTitle')}</h2>
                <Container color="black.600">
                  {t('how')}
                  <br />
                  <ol>
                    <li>{t('how1')}</li>
                    <li>{t('how2')}</li>
                    <li>{t('how3')}</li>
                  </ol>
                </Container>
                <p>{t('how4')}</p>
              </div>
              <div className="column is-6">
                <br />
                <br />
                <img src={imgExample1} alt="exemple video captainfact" />
                <br />
                <ExternalLinkNewTab href="https://www.youtube.com/watch?v=LsRkg2hRTiI">
                  {t('demo')} <ExternalLinkAlt size="1em" />
                </ExternalLinkNewTab>
              </div>
            </div>
            <div className="columns">
              <div className="column is-6">
                <br />
                <br />
                <img src={examplesImg1} alt="exemple image captainfact" />
                <br />
                <br />
              </div>
              <div className="column is-6 presentation content">
                <br />
                <br />
                <h2 className="title-alt">{t('example1Title1')}</h2>
                <h2 className="title light-title is-3">{t('example1Title2')}</h2>
                <p>
                  {t('example1Text')}
                  <br />
                </p>
                <Link
                  onClick={() => Matomo.registerClick('Home', 'Button', 'ExtensionPage')}
                  className="button is-primary is-medium"
                  to="/extension"
                >
                  {t('installExtension')}
                </Link>
              </div>
            </div>
            <div className="columns">
              <div className="column is-6 presentation content">
                <br />
                <br />
                <h2 className="title-alt">{t('example2Title1')}</h2>
                <h2 className="title light-title is-3">{t('example2Title2')}</h2>
                <p>
                  {t('example2Text')}
                  <br />
                </p>
                <Link
                  onClick={() => Matomo.registerClick('Home', 'Button', 'SignUp')}
                  className="button is-primary is-medium"
                  to="/signup"
                >
                  {t('registerAndFactCheck')}
                </Link>
              </div>
              <div className="column is-6 ">
                <br />
                <br />
                <img src={examplesImg2} alt="exemple image captainfact" />
                <br />
                <br />
              </div>
            </div>
            <div className="columns">
              <div className="column is-6">
                <br />
                <br />
                <img src={examplesImg3} alt="exemple image captainfact" />
                <br />
                <br />
              </div>
              <div className="column is-6 presentation content">
                <br />
                <br />
                <h2 className="title-alt">{t('example3Title1')}</h2>
                <h2 className="title light-title is-3">{t('example3Title2')}</h2>
                <p>
                  {t('example3Text')}
                  <br />
                </p>
                <ExternalLinkNewTab
                  className="button is-primary is-medium"
                  href="https://github.com/CaptainFact/captain-fact/wiki/Les-partenariats-entre-les-chaînes-Youtube-et-CaptainFact.io"
                >
                  {t('learnMore')} (fr)
                </ExternalLinkNewTab>
              </div>
            </div>
          </div>
        </section>

        <section className="section hero section-alt-bg">
          <div className="hero-body">
            <div className="columns">
              <div className="column is-6">
                <h2 className="title-alt is-bold">{t('forWho1Title1')}</h2>
                <h2 className="title light-title is-3">{t('forWho1Title2')}</h2>
                <p className="presentation">{t('forWho1Text')}</p>
              </div>
              <div className="column is-6">
                <h2 className="title-alt is-bold">{t('forWho2Title1')}</h2>
                <h2 className="title light-title is-3">{t('forWho2Title2')}</h2>
                <p className="presentation">{t('forWho2Text')}</p>
              </div>
            </div>
            <Link
              onClick={() => Matomo.registerClick('Home', 'Button', 'ContactUs')}
              className="button is-primary is-medium"
              to="/help/contact"
            >
              {t('contactus')}
            </Link>
          </div>
        </section>

        {this.props.lng === 'fr' && (
          <section className="section know-more-fr has-text-centered">
            <p className="has-text-weight-semibold">
              {t('knowMoreFR')}
              <br />
              <ExternalLinkNewTab
                className="button is-primary is-large"
                href="https://fr.captainfact.io"
              >
                {t('goToFRSite')}
              </ExternalLinkNewTab>
            </p>
          </section>
        )}

        <section className="section">
          <CFSocialProfiles size="3em" color="white" />
        </section>

        <footer className="footer">
          <div className="has-text-centered">
            <Trans i18nKey="footer">
              Created with <Icon name="heart" /> using
            </Trans>
            <ExternalLinkNewTab href="https://elixir-lang.org">Elixir</ExternalLinkNewTab>
            ,&nbsp;
            <ExternalLinkNewTab href="https://phoenixframework.org">Phoenix</ExternalLinkNewTab>
            &nbsp;{t('main:misc.and')}&nbsp;
            <ExternalLinkNewTab href="https://reactjs.org/">React</ExternalLinkNewTab>
          </div>
        </footer>
      </div>
    )
  }
}
