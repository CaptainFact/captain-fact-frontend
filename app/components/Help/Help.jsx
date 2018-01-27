import React from "react"

import { Link, withRouter } from 'react-router'
import { Icon } from '../Utils/Icon'
import { translate } from 'react-i18next'
import HelpPageContent from './HelpPageContent'
import PublicAchievementUnlocker from '../Users/PublicAchievementUnlocker'


@translate(['help', 'main'])
@withRouter
export default class Help extends React.PureComponent {
  render() {
    const { t, routeParams: {splat} } = this.props

    let header, content
    if (!splat) {
      header = <h1 className="title is-1">{t('main:menu.help')}</h1>
      content = this.renderIndexContent()
    }
    else {
      header = this.renderPageHeader()
      content = <HelpPageContent page={this.props.routeParams.splat}/>
    }
    return (
      <div className="help-page">
        <section className="hero is-info is-bold">
          <div className="hero-body">
            <div className="container">
              { header }
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            { content }
          </div>
        </section>
        <PublicAchievementUnlocker achievementId={3}/>
      </div>
    )
  }

  renderIndexContent() {
    return (
      <div className="">
        <div className="columns">
          <div className="column panel">
            <p className="panel-heading">{this.props.t('categories.siteUsage')}</p>
            {this.renderPageLink('achievements')}
            {this.renderPageLink('moderation')}
            {this.renderPageLink('privileges')}
            {this.renderPageLink('reputation')}
          </div>
          <div className="column panel">
            <p className="panel-heading">{this.props.t('categories.contribute')}</p>
            {this.renderPageLink('bug_report')}
            {this.renderPageLink('contribute/code')}
            {this.renderPageLink('contribute/graphic')}
            {this.renderPageLink('contribute/law')}
            {this.renderPageLink('contribute/translate')}
          </div>
          <div className="column panel">
            <p className="panel-heading">{this.props.t('categories.others')}</p>
            {this.renderPageLink('contact')}
            {this.renderPageLink('censorship_requests')}
            {this.renderPageLink('credits')}
            {this.renderPageLink('extension')}
            {this.renderPageLink('privacy')}
          </div>
        </div>
      </div>
    )
  }

  renderPageLink(splat) {
    return (
      <div className="panel-block">
        <Link to={`/help/${splat}`} style={{width: '100%', height: '100%'}}>
          {this.props.t(`pages.${splat}`, {defaultValue: splat})}
        </Link>
      </div>
    )
  }

  renderPageHeader() {
    const { t, routeParams: { splat } } = this.props
    return (
      <div>
        <h1 className="title is-1">
          {t('main:menu.help')}: {t(`help:pages.${splat}`, {defaultValue: "I am lost 😟"})}
        </h1>
        <Link className="subtitle" to="/help">
          <Icon name="arrow-left"/>
          <span> {t('goBack')}</span>
        </Link>
      </div>
    )
  }
}
