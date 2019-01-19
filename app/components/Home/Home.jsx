import React from 'react'
import { Link } from 'react-router'
import { withNamespaces, Trans } from 'react-i18next'
import { Flex, Box } from '@rebass/grid'

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

@withNamespaces('home')
@withLoggedInUser
export default class Home extends React.PureComponent {
  renderPresentation() {
    return (
      <p className="presentation">
        {this.props.t('presentation1')}
        <br />
        <br />
        <strong>CaptainFact</strong> {this.props.t('presentation2')}
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
          100%{' '}
          <ExternalLinkNewTab href="https://github.com/CaptainFact">
            open-source
          </ExternalLinkNewTab>
          , respecte votre vie privée
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
                <h1 className="title is-3">Let's check the Internet</h1>
                {this.renderPresentation()}
              </div>
              <div className="column is-1" />
              <div className="column">
                <h1 className="title is-3">{t('start')}</h1>
                {this.renderButtons()}
              </div>
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
            <h1 className="title is-3">Les dernières vidéos ajoutées</h1>
            <Link
              onClick={() => Matomo.registerClick('Home', 'Button', 'SeeAllVideos')}
              className="button animated-hover is-medium is-gradient-primary-light"
              to="/videos"
            >
              {this.props.t('seeVideos')}
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
                {this.props.t(this.props.isAuthenticated ? 'inviteFriend' : 'invitation')}
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
            &nbsp;{this.props.t('main:misc.and')}&nbsp;
            <ExternalLinkNewTab href="https://reactjs.org/">React</ExternalLinkNewTab>
          </div>
        </footer>
      </div>
    )
  }
}
