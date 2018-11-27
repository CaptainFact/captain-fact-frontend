import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import { Link } from 'react-router'

import { isExternal, isDownloadableFile } from '../../lib/url_utils'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { ErrorView } from '../Utils/ErrorView'
import { fetchHelpPage } from '../../state/help/effects'
import { reset } from '../../state/help/reducer'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

@connect(
  state => ({
    markdownContent: state.Help.markdownContent,
    isLoading: state.Help.isLoading,
    error: state.Help.error,
    locale: state.UserPreferences.locale
  }),
  { fetchHelpPage, reset }
)
class HelpPageContent extends PureComponent {
  constructor(props) {
    super(props)
    this.renderers = { link: this.renderLink.bind(this) }
  }

  componentDidMount() {
    this.props.fetchHelpPage(this.props.page)
  }

  componentDidUpdate(oldProps) {
    if (this.props.locale !== oldProps.locale || this.props.page !== oldProps.page)
      this.props.fetchHelpPage(this.props.page)
  }

  componentWillUnmount() {
    this.props.reset()
  }

  render() {
    if (this.props.isLoading) return <LoadingFrame />
    if (this.props.error) return <ErrorView canGoBack={false} error={this.props.error} />
    return (
      <Markdown
        className="content"
        source={this.props.markdownContent}
        renderers={this.renderers}
      />
    )
  }

  renderLink({ href, children }) {
    if (isExternal(window.location.href, href) || isDownloadableFile(href))
      return <ExternalLinkNewTab href={href}>{children}</ExternalLinkNewTab>
    return (
      <Link to={href} onClick={this.props.onLinkClick}>
        {children}
      </Link>
    )
  }
}

HelpPageContent.propTypes = {
  page: PropTypes.string.isRequired,
  onLinkClick: PropTypes.func
}

export default HelpPageContent
