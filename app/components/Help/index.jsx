import React from "react"
import { connect } from 'react-redux'
import Markdown from 'react-markdown'

import { LoadingFrame } from '../Utils'
import { Link, withRouter } from 'react-router'
import { Icon } from '../Utils/Icon'
import { ErrorView } from '../Utils/ErrorView'
import { translate } from 'react-i18next'
import { fetchHelpPage } from '../../state/help/effects'
import { reset } from '../../state/help/reducer'
import { isExternal } from '../../lib/url_utils'


const MARKDOWN_RENDERERS = {
  link: ({href, children}) => {
    if (isExternal(window.location.href, href))
      return <a href={href}>{children}</a>
    else
      return <Link to={href}>{children}</Link>
  }
}

@connect(state => ({
  markdownContent: state.Help.markdownContent,
  isLoading: state.Help.isLoading,
  error: state.Help.error,
  locale: state.UserPreferences.locale
}), {fetchHelpPage, reset})
@translate(['help', 'main'])
@withRouter
export default class Help extends React.PureComponent {
  componentDidMount() {
    if (this.props.routeParams.splat)
      this.props.fetchHelpPage(this.props.routeParams.splat)
  }

  componentDidUpdate(prevProps) {
    const requestedPageName = this.props.routeParams.splat
    if (!requestedPageName)
      this.props.reset()
    else if (prevProps.routeParams.splat !== requestedPageName || prevProps.locale !== this.props.locale)
      this.props.fetchHelpPage(requestedPageName)
  }

  componentWillUnmount() {
    this.props.reset()
  }

  render() {
    const { t, routeParams: {splat} } = this.props

    let header, content
    if (!splat) {
      header = <h1 className="title is-1">{t('main:menu.help')}</h1>
      content = this.renderIndexContent()
    } else {
      header = this.renderPageHeader()
      content = this.renderPageContent()
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
      </div>
    )
  }

  renderIndexContent() {
    return (
      <div className="">
        <div className="columns">
          <div className="column panel">
            <p className="panel-heading">{this.props.t('categories.siteUsage')}</p>
            {this.renderPageLink('privileges')}
            {this.renderPageLink('reputation')}
            {this.renderPageLink('achievements')}
            {this.renderPageLink('moderation')}
            {this.renderPageLink('code_of_conduct')}
          </div>
          <div className="column panel">
            <p className="panel-heading">{this.props.t('categories.contribute')}</p>
            {this.renderPageLink('contribute/code')}
            {this.renderPageLink('contribute/graphic')}
            {this.renderPageLink('contribute/law')}
            {this.renderPageLink('contribute/translate')}
            {this.renderPageLink('bug_report')}
          </div>
          <div className="column panel">
            <p className="panel-heading">{this.props.t('categories.others')}</p>
            {this.renderPageLink('contact')}
            {this.renderPageLink('censorship_requests')}
            {this.renderPageLink('extension')}
            {this.renderPageLink('privacy')}
            {this.renderPageLink('credits')}
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
          <span> {t('main:actions.goBack')}</span>
        </Link>
      </div>
    )
  }

  renderPageContent() {
    if (this.props.isLoading)
      return <LoadingFrame/>
    if (this.props.error)
      return <ErrorView canGoBack={false} error={this.props.error}/>
    return <Markdown className="content" source={this.props.markdownContent} renderers={MARKDOWN_RENDERERS}/>
  }
}
