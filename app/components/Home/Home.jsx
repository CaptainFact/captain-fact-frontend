import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { withNamespaces, Trans } from 'react-i18next'

import { Icon } from '../Utils'
import InvitationRequestForm from '../Users/InvitationRequestForm'
import { isAuthenticated } from '../../state/users/current_user/selectors'
import { INVITATION_SYSTEM } from '../../config'
import landingIllustration from '../../assets/landing-illustration.jpg'
import AllPartners from './AllPartners'
import OpenCollectiveContributors from './OpenCollectiveContributors'
import AllAmbassadors from './AllAmbassadors'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import CFSocialProfiles from './CFSocialProfiles'

@connect(state => ({ authenticated: isAuthenticated(state) }))
@withNamespaces('home')
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
        <Link className="button is-medium is-gradient-primary-light" to="/videos">
          {this.props.t('seeVideos')}
        </Link>
        <Link className="button is-medium is-gradient-primary-light" to="/signup">
          {this.props.t('registerAndFactCheck')}
        </Link>
        <Link className="button is-medium is-gradient-primary-light" to="/extension">
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
            <AllPartners />
            <br />
            <h1 className="title is-3">{t('contributors')}</h1>
            <OpenCollectiveContributors tier="donateur" showBtn={false} />
            <br />
            <h1 className="title is-3">{t('ambassadors')}</h1>
            <AllAmbassadors />
            <br />
            <br />
            <br />
          </div>
        </section>
        <section className="section">
          <CFSocialProfiles size="3em" />
        </section>
        <section className="section has-text-centered illustration">
          <h1 className="title is-3">Quelques vidéos au hasard</h1>
          <br />
          <br />
          <br />
          <img src={landingIllustration} alt="" />
        </section>
        {INVITATION_SYSTEM && (
          <section className="section request-invitation">
            <h4 className="title is-4">
              <Icon name="envelope-o" />
              <span>
                &nbsp;&nbsp;
                {this.props.t(this.props.authenticated ? 'inviteFriend' : 'invitation')}
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
