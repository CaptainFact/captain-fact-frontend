import React from 'react'
import Link from 'next/link'
import { Flex, Box } from '@rebass/grid'

import * as Matomo from '../app/API/matomo'
import { INVITATION_SYSTEM } from '../app/config'
import { Icon } from '../app/components/Utils'
import InvitationRequestForm from '../app/components/Users/InvitationRequestForm'
import ExternalLinkNewTab from '../app/components/Utils/ExternalLinkNewTab'
import { withLoggedInUser } from '../app/components/LoggedInUser/UserProvider'
import Message from '../app/components/Utils/Message'
import OpenCollectiveContributors from '../app/components/Home/OpenCollectiveContributors'
import AllAmbassadors from '../app/components/Home/AllAmbassadors'
import CFSocialProfiles from '../app/components/Home/CFSocialProfiles'
import LastVideos from '../app/components/Home/LastVideos'
import AllPartners from '../app/components/Home/AllPartners'

class Home extends React.PureComponent {
  renderPresentation() {
    return (
      <p className="presentation">
        <strong>CaptainFact</strong> est un outil collaboratif de vérification des vidéos
        YouTube.
        <br />
        Inscrivez-vous pour commencer à démentir, à confirmer ou à approfondir les faits.
        <br />
        Installez notre extension pour bénéficier des données de CaptainFact directement
        depuis votre lecteur YouTube.
      </p>
    )
  }

  renderButtons() {
    const t = s => s
    return (
      <div className="buttons-container">
        <Link
          onClick={() => Matomo.registerClick('Home', 'Button', 'SignUp')}
          className="button animated-hover is-medium is-gradient-primary-light"
          to="/signup"
        >
          {t('registerAndFactCheck')}
        </Link>
        <Link
          onClick={() => Matomo.registerClick('Home', 'Button', 'ExtensionPage')}
          className="button animated-hover is-medium is-gradient-primary-light"
          to="/extension"
        >
          {t('installExtension')}
        </Link>
        <div className="button-label">
          100%{' '}
          <ExternalLinkNewTab href="https://github.com/CaptainFact">
            open-source
          </ExternalLinkNewTab>
          , respects your privacy.
        </div>
      </div>
    )
  }

  render() {
    const t = s => s

    return (
      <div className="home-page is-gradient-primary">
        <section className="hero is-medium is-bold">
          <div className="hero-body">
            <div className="columns">
              <div className="column is-6">
                <h1 className="title is-3">{t('presentationTitle')}</h1>
                {this.renderPresentation()}
              </div>
              <div className="column is-1" />
              <div className="column">{this.renderButtons()}</div>
            </div>
          </div>
        </section>
        <section className="separator" />
        <section className="section partners">
          <div className="content">
            <h1 className="title is-3">{t('partners')}</h1>
            <br />
            <AllPartners />
            <br />
            <br />
            <br />
            <Flex flexWrap="wrap">
              <Box width={[1, 1, 0.5, 0.5, 1 / 3]} mb="2em">
                <h1 className="title is-3">{t('backers')}</h1>
                <OpenCollectiveContributors
                  tier="soutien-régulier"
                  button={false}
                  limit={8}
                />
                <OpenCollectiveContributors tier="donateur" button={false} limit={8} />
              </Box>
              <Box width={[1, 1, 0.5, 0.5, 2 / 3]}>
                <h1 className="title is-3">{t('ambassadors')}</h1>
                <Message>
                  {t('aboutAmbassadors')}{' '}
                  <Link to="/help/ambassadors">{t('learnMore')}</Link>
                </Message>
                <AllAmbassadors />
              </Box>
            </Flex>
            <br />
          </div>
        </section>
        <section className="section">
          <CFSocialProfiles size="3em" color="white" />
        </section>
        <section className="section last-videos" style={{ paddingBottom: '3em' }}>
          <br />
          <br />
          <div className="has-text-centered">
            <h1 className="title is-3">{t('latest')}</h1>
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
            Created with <Icon name="heart" /> using
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

export default withLoggedInUser(Home)
