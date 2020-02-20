import React from 'react'
import { Link } from 'react-router'
import { withNamespaces, Trans } from 'react-i18next'
import { Flex, Box } from '@rebass/grid'
import { Discourse } from 'styled-icons/fa-brands/Discourse'
import { ExternalLinkAlt } from 'styled-icons/fa-solid/ExternalLinkAlt'

import * as Matomo from '../../API/matomo'
import { Icon } from '../Utils'
import InvitationRequestForm from '../Users/InvitationRequestForm'
import { INVITATION_SYSTEM } from '../../config'
import AllPartners from './AllPartners'
import OpenCollectiveContributors from './OpenCollectiveContributors'
import AllAmbassadors from './AllAmbassadors'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import CFSocialProfiles from './CFSocialProfiles'
import LastVideos from './LastVideos'
import Message from '../Utils/Message'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import imgMedia from '../../assets/media.jpg'
import imgExample1 from '../../assets/example1.jpg'
import imgIllutration from '../../assets/landing-illustration.png'

@withNamespaces('home')
@withLoggedInUser
export default class Home extends React.PureComponent {
  renderPresentation() {
    return (
      <p className="presentation">
        <Trans i18nKey="presentation">
          <strong>CaptainFact</strong> est un outil collaboratif de vérification des
          vidéos YouTube.
          <br />
          Inscrivez-vous pour commencer à démentir, à confirmer ou à approfondir les
          faits.
          <br />
          Installez notre extension pour bénéficier des données de CaptainFact directement
          depuis votre lecteur YouTube.
        </Trans>
      </p>
    )
  }

  renderButtons() {
    return (
      <div className="buttons-container">
        <Link
          onClick={() => Matomo.registerClick('Home', 'Button', 'SignUp')}
          className="button animated-hover is-medium is-gradient-primary-light"
          to="/signup"
        >
          {this.props.t('registerAndFactCheck')}
        </Link>
        <Link
          onClick={() => Matomo.registerClick('Home', 'Button', 'ExtensionPage')}
          className="button animated-hover is-medium is-gradient-primary-light"
          to="/extension"
        >
          {this.props.t('installExtension')}
        </Link>
        <div className="button-label">
          <Trans i18nKey="openSource">
            100%{' '}
            <ExternalLinkNewTab href="https://github.com/CaptainFact">
              open-source
            </ExternalLinkNewTab>
            , respects your privacy.
          </Trans>
        </div>
      </div>
    )
  }

  render() {
    const { t } = this.props

    return (
      <div className="home-page is-gradient-primary">
        <section className="hero is-medium is-bold">
          <div className="hero-body">
            <div className="columns">
              <div className="column is-6">
                <h1 className="title1">{t('titleCF')}</h1>
                <h2 className="title">{t('presentationTitle')}</h2>
                <ExternalLinkNewTab href="https://fr.kantar.com/médias/digital/2019/barometre-2019-de-la-confiance-des-francais-dans-les-media/">
                  {t('source')}
                </ExternalLinkNewTab>
                {this.renderPresentation()}
                {this.renderButtons()}
              </div>
              <img src={imgMedia} alt="media effects" />
            </div>
          </div>
        </section>

        <section className="section partners">
          <div className="content">
            <h2 className="title is-3">{t('partners')}</h2>
            <br />
            <AllPartners />
            <br />
            <ExternalLinkNewTab href="https://github.com/CaptainFact/captain-fact/wiki/Les-partenariats-entre-les-chaînes-Youtube-et-CaptainFact.io">
              {t('partners-info')} <ExternalLinkAlt size="1em" />
            </ExternalLinkNewTab>
            <br />
          </div>
        </section>

        <section className="hero is-medium is-bold">
          <div className="hero-body">
            <div className="columns">
              <div className="column is-6 presentation content">
                <br />
                <br />
                <h2 className="title is-3">{t('howTitle')}</h2>
                <p>
                  {t('how')}
                  <br />
                  <ol>
                    <li>{t('how1')}</li>
                    <li>{t('how2')}</li>
                    <li>{t('how3')}</li>
                  </ol>
                </p>
                <p>{t('how4')}</p>
                <br />
                <Link
                  onClick={() => Matomo.registerClick('Home', 'Button', 'ExtensionPage')}
                  className="button animated-hover is-medium is-gradient-primary-light"
                  to="/extension"
                >
                  {t('installExtension')}
                </Link>
              </div>
              <div className="column is-6">
                <br />
                <br />
                <img src={imgExample1} alt="exemple video captainfact" />
                <br />
                <ExternalLinkNewTab href="https://www.youtube.com/watch?v=LsRkg2hRTiI">
                  {t('demo')} <ExternalLinkAlt size="1em" />
                </ExternalLinkNewTab>
                <br />
                <br />
              </div>
            </div>
          </div>
        </section>

        <section className="hero is-medium is-bold">
          <div className="hero-body">
            <div className="columns">
              <div className="column is-6">
                <br />
                <br />
                <img src={imgIllutration} alt="community" />
              </div>
              <div className="column is-6">
                <h2 className="title is-3">{t('whoTitle')}</h2>
                <p className="presentation">{t('who')}</p>
                <br />
                <Link
                  onClick={() => Matomo.registerClick('Home', 'Button', 'SignUp')}
                  className="button animated-hover is-medium is-gradient-primary-light"
                  to="/signup"
                >
                  {t('registerAndFactCheck')}
                </Link>
                <br />
                <br />
                <ExternalLinkNewTab href="https://discord.gg/Z22Vhda">
                  <Discourse size="1.5em" /> {t('forum')}
                </ExternalLinkNewTab>

                <br />
                <br />
              </div>
            </div>
          </div>
        </section>

        <section className="section partners">
          <div className="content">
            <Flex flexWrap="wrap">
              <Box width={[1, 1, 0.5, 0.5, 1 / 3]} mb="2em">
                <h2 className="title is-3">{t('backers')}</h2>
                <OpenCollectiveContributors
                  tier="soutien-régulier"
                  button={false}
                  limit={8}
                />
                <OpenCollectiveContributors tier="donateur" button={false} limit={8} />
              </Box>
              <Box width={[1, 1, 0.5, 0.5, 2 / 3]}>
                <h2 className="title is-3">{t('ambassadors')}</h2>
                <Message>
                  {t('aboutAmbassadors')}{' '}
                  <Link to="/help/ambassadors">{t('learnMore')}</Link>
                </Message>
                <AllAmbassadors />
              </Box>
            </Flex>
            <br />
          </div>
          <div className="has-text-centered">
            <h2 className="title is-3">{t('followus')}</h2>
          </div>
        </section>

        <section className="section">
          <CFSocialProfiles size="3em" color="white" />
        </section>
        <section className="section last-videos" style={{ paddingBottom: '3em' }}>
          <br />
          <br />
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
        {INVITATION_SYSTEM && (
          <section className="section request-invitation">
            <h4 className="title is-4" style={{ color: 'white' }}>
              <Icon name="envelope-o" />
              <span>
                &nbsp;&nbsp;
                {t(this.props.isAuthenticated ? 'inviteFriend' : 'invitation')}
              </span>
            </h4>
            <InvitationRequestForm />
          </section>
        )}
        <footer className="footer">
          <div className="has-text-centered">
            <Trans i18nKey="footer">
              Created with <Icon name="heart" /> using
            </Trans>
            <ExternalLinkNewTab href="https://elixir-lang.org">Elixir</ExternalLinkNewTab>
            ,&nbsp;
            <ExternalLinkNewTab href="https://phoenixframework.org">
              Phoenix
            </ExternalLinkNewTab>
            &nbsp;{t('main:misc.and')}&nbsp;
            <ExternalLinkNewTab href="https://reactjs.org/">React</ExternalLinkNewTab>
          </div>
        </footer>
      </div>
    )
  }
}
