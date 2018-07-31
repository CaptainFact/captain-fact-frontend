import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { translate, Interpolate } from 'react-i18next'

import { Icon } from '../Utils'
import InvitationRequestForm from '../Users/InvitationRequestForm'
import { isAuthenticated } from '../../state/users/current_user/selectors'
import Logo from '../App/Logo'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { INVITATION_SYSTEM } from '../../config'
import AllContributors from './AllContributors'


@connect(state => ({authenticated: isAuthenticated(state)}))
@translate('home')
export class Home extends React.PureComponent {
  render() {
    const {t} = this.props

    return (
      <div className="home-page">
        <section className="hero is-medium is-bold">
          <div className="hero-body">
            <div className="has-text-centered">
              <Logo/>
              <h2 className="subtitle is-3 has-text-weight-light">
                Let's check the Internet
              </h2>
            </div>
          </div>
        </section>
        <section className="section presentation">
          <div className="has-text-weight-light is-size-3">
            <p>
              {t('presentation1')}
              <br/><br/>
              <strong>CaptainFact</strong> {t('presentation2')}
            </p>
            <br/>
          </div>
        </section>
        <section className="section has-text-centered actions">
          <Link className="button is-large" to="/help">
            <Icon name="question-circle"/>&nbsp;&nbsp; {t('main:menu.help')}
          </Link>
          <Link className="button is-large" to="/videos">
            <Icon name="tv"/>&nbsp;&nbsp; {t('seeVideos')}
          </Link>
          <ExternalLinkNewTab className="button is-large" href="https://opencollective.com/captainfact_io">
            <Icon name="heart"/>&nbsp;&nbsp; {t('main:menu.donation')}
          </ExternalLinkNewTab>
        </section>
        <section className="section has-text-centered">
          <img src="assets/img/landing-illustration.jpg" alt=""/>
        </section>
        <section className="section has-text-centered community content">
          <h1>Communauté</h1>
          <p className="is-size-5">
            <Icon name="user"/> 1783 utilisateurs inscrits
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Icon name="check"/> 1250 affirmations vérifiées
          </p>
        </section>
        <section className="section has-text-centered contributors content">
          <h1>Contributeurs</h1>
          <AllContributors/>
        </section>
        {INVITATION_SYSTEM && (
          <section className="section request-invitation">
            <h4 className="title is-4">
              <Icon name="envelope-o"/>
              <span>
                &nbsp;&nbsp;
                {this.props.t(this.props.authenticated ? 'inviteFriend' : 'invitation')}
              </span>
            </h4>
            <InvitationRequestForm/>
          </section>
        )}
        <footer className="footer">
          <div className="has-text-centered">
            <Interpolate i18nKey="footer" iconLove={<Icon name="heart"/>}/>
            <a href="http://elixir-lang.org">Elixir</a>,&nbsp;
            <a href="http://www.phoenixframework.org">Phoenix</a>
            &nbsp;{this.props.t('main:misc.and')}&nbsp;
            <a href="https://facebook.github.io/react">React</a>
          </div>
        </footer>
      </div>
    )
  }
}
