import React from 'react'
import { Trans, withNamespaces } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'

import PublicAchievementUnlocker from '../Users/PublicAchievementUnlocker'
import { Icon } from '../Utils/Icon'
import Message from '../Utils/Message'
import HelpPageContent from './HelpPageContent'

@withNamespaces('help')
@withRouter
export default class Help extends React.PureComponent {
  render() {
    const { t, location } = this.props
    const cleanPathName = location.pathname.replace(/\/+$/, '') // Remove trailing slashes
    const subPage = cleanPathName.replace(/^\/help\/?/, '') || null

    let header = ''
    let content = ''
    if (!subPage) {
      header = <h1 className="title is-1">{t('title')}</h1>
      content = this.renderIndexContent()
    } else {
      header = this.renderPageHeader(subPage)
      content = <HelpPageContent page={subPage} />
    }

    return (
      <div className="help-page">
        <section className="hero is-primary is-bold">
          <div className="hero-body">
            <div className="section">{header}</div>
          </div>
        </section>
        <section className="section">{content}</section>
        <PublicAchievementUnlocker achievementId={3} />
      </div>
    )
  }

  renderIndexContent() {
    return (
      <div>
        <Message type="primary" header={this.props.t('aboutTitle')}>
          {this.props.t('about')}&nbsp;
          <Trans i18nKey="toStart">
            toStart
            {this.renderPageLink('contributionGuidelines')}
            {this.renderPageLink('privileges')}
            {this.renderPageLink('reputation')}
          </Trans>
        </Message>
        <div className="columns">
          <div className="column panel">
            <p className="panel-heading">{this.props.t('categories.siteUsage')}</p>
            {this.renderPageMenuEntry('contributionGuidelines')}
            {this.renderPageMenuEntry('privileges')}
            {this.renderPageMenuEntry('reputation')}
            {this.renderPageMenuEntry('moderation')}
            {this.renderPageMenuEntry('achievements')}
            {this.renderPageMenuEntry('extension')}
          </div>
          <div className="column panel">
            <p className="panel-heading">{this.props.t('categories.contribute')}</p>
            {this.renderPageMenuEntry('ambassadors')}
            {this.renderPageMenuEntry('contribute/tasks')}
            {this.renderPageMenuEntry('bug_report')}
          </div>
          <div className="column panel">
            <p className="panel-heading">{this.props.t('categories.others')}</p>
            {this.renderPageMenuEntry('about')}
            {this.renderPageMenuEntry('contact')}
            {this.renderPageMenuEntry('credits')}
            {this.renderPageMenuEntry('privacy')}
          </div>
        </div>
      </div>
    )
  }

  renderPageMenuEntry(subPage) {
    const label = this.props.t(`pages.${subPage}`, { defaultValue: subPage })
    return <div className="panel-block">{this.renderPageLink(subPage, label)}</div>
  }

  renderPageLink(subPage, label) {
    return <Link to={`/help/${subPage}`}>{label || subPage}</Link>
  }

  renderPageHeader(subPage) {
    const { t } = this.props
    return (
      <div>
        <h1 className="title is-1">
          {t('title')}: {t(`help:pages.${subPage}`, { defaultValue: 'I am lost 😟' })}
        </h1>
        <Link className="subtitle" to="/help">
          <Icon name="arrow-left" />
          <span> {t('goBack')}</span>
        </Link>
      </div>
    )
  }
}
