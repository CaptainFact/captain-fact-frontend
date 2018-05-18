import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { translate, Interpolate } from 'react-i18next'

import { Icon } from '../Utils'
import InvitationRequestForm from '../Users/InvitationRequestForm'
import { isAuthenticated } from '../../state/users/current_user/selectors'
import Logo from '../App/Logo'


@connect(state => ({authenticated: isAuthenticated(state)}))
@translate('home')
export class Home extends React.PureComponent {
  render() {
    return (
      <div className="home-page">
        <section className="hero is-medium is-bold is-warning">
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
              {this.props.t('presentation1')}
              <br/><br/>
              <strong>CaptainFact</strong> {this.props.t('presentation2')}
            </p>
            <br/>
            <p>
              <Interpolate
                i18nKey="journeyStart"
                videoLink={
                  <Link to="/videos">{this.props.t('main:entities.video_plural')}</Link>
                }
              />
              <br/>
              <br/>
            </p>
          </div>
        </section>
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
