import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Trans, withTranslation } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'

import { Card } from '../ui/card'
import PublicAchievementUnlocker from '../Users/PublicAchievementUnlocker'
import HelpPageContent from './HelpPageContent'

@withTranslation('help')
@withRouter
export default class Help extends React.PureComponent {
  render() {
    const { t, location } = this.props
    const cleanPathName = location.pathname.replace(/\/+$/, '') // Remove trailing slashes
    const subPage = cleanPathName.replace(/^\/help\/?/, '') || null

    let header = ''
    let content = ''
    if (!subPage) {
      header = <h1 className="text-3xl sm:text-5xl font-bold">{t('title')}</h1>
      content = this.renderIndexContent()
    } else {
      header = this.renderPageHeader(subPage)
      content = <HelpPageContent page={subPage} />
    }

    return (
      <div className="help-page">
        <section className="bg-gradient-to-tr py-20 from-primary to-primary/90 text-white">
          <div className="container mx-auto px-4">{header}</div>
        </section>
        <section className="container mx-auto px-4 py-8">{content}</section>
        <PublicAchievementUnlocker achievementId={3} />
      </div>
    )
  }

  renderIndexContent() {
    return (
      <div>
        <div className="mb-8 rounded overflow-hidden shadow-lg bg-white">
          <h4 className="font-bold mb-2 p-4 bg-primary text-white">{this.props.t('aboutTitle')}</h4>
          <p className="p-4">
            {this.props.t('about')}&nbsp;
            <Trans i18nKey="help:toStart">
              toStart
              {this.renderPageLink('contributionGuidelines', null, 'underline')}
              {this.renderPageLink('privileges', null, 'underline')}
              {this.renderPageLink('reputation', null, 'underline')}
            </Trans>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden rounded-md">
            <div className="bg-gray-100 p-3 font-semibold border-b">
              {this.props.t('categories.siteUsage')}
            </div>
            {this.renderPageMenuEntry('contributionGuidelines')}
            {this.renderPageMenuEntry('privileges')}
            {this.renderPageMenuEntry('reputation')}
            {this.renderPageMenuEntry('moderation')}
            {this.renderPageMenuEntry('achievements')}
            {this.renderPageMenuEntry('extension')}
          </Card>
          <Card className="overflow-hidden rounded-md">
            <div className="bg-gray-100 p-3 font-semibold border-b">
              {this.props.t('categories.contribute')}
            </div>
            {this.renderPageMenuEntry('ambassadors')}
            {this.renderPageMenuEntry('contribute/tasks')}
            {this.renderPageMenuEntry('bug_report')}
          </Card>
          <Card className="overflow-hidden rounded-md">
            <div className="bg-gray-100 p-3 font-semibold border-b">
              {this.props.t('categories.others')}
            </div>
            {this.renderPageMenuEntry('about')}
            {this.renderPageMenuEntry('contact')}
            {this.renderPageMenuEntry('credits')}
            {this.renderPageMenuEntry('privacy')}
          </Card>
        </div>
      </div>
    )
  }

  renderPageMenuEntry(subPage) {
    const label = this.props.t(`pages.${subPage}`, { defaultValue: subPage })
    return this.renderPageLink(
      subPage,
      label,
      'p-3 block hover:bg-gray-50 border-b hover:underline text-black',
    )
  }

  renderPageLink(subPage, label, className) {
    return (
      <Link className={className} to={`/help/${subPage}`}>
        {label || subPage}
      </Link>
    )
  }

  renderPageHeader(subPage) {
    const { t } = this.props
    return (
      <div>
        <h1 className="text-4xl font-bold mb-4">
          {t('title')}: {t(`help:pages.${subPage}`, { defaultValue: 'I am lost 😟' })}
        </h1>
        <Link
          to="/help"
          className="text-lg flex items-center text-gray-100 hover:text-gray-50 hover:underline"
        >
          <ArrowLeft size="1em" />
          <span className="ml-2">{t('goBack')}</span>
        </Link>
      </div>
    )
  }
}
