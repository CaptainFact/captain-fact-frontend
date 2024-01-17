import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Markdown from 'react-markdown'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import remarkGfm from 'remark-gfm'

import { isDownloadableFile, isExternal } from '../../lib/url_utils'
import { fetchHelpPage } from '../../state/help/effects'
import { reset } from '../../state/help/reducer'
import { ErrorView } from '../Utils/ErrorView'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { LoadingFrame } from '../Utils/LoadingFrame'

@connect(
  (state) => ({
    markdownContent: state.Help.markdownContent,
    isLoading: state.Help.isLoading,
    error: state.Help.error,
    locale: state.UserPreferences.locale,
  }),
  { fetchHelpPage, reset },
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
    if (this.props.locale !== oldProps.locale || this.props.page !== oldProps.page) {
      this.props.fetchHelpPage(this.props.page)
    }
  }

  componentWillUnmount() {
    this.props.reset()
  }

  render() {
    if (this.props.isLoading) {
      return <LoadingFrame />
    }
    if (this.props.error) {
      return <ErrorView canGoBack={false} error={this.props.error} />
    }
    return (
      <Markdown className="content" renderers={this.renderers} remarkPlugins={[remarkGfm]}>
        {this.props.markdownContent}
      </Markdown>
    )
  }

  renderLink({ href, children }) {
    if (isExternal(window.location.href, href) || isDownloadableFile(href)) {
      return <ExternalLinkNewTab href={href}>{children}</ExternalLinkNewTab>
    }
    return (
      <Link to={href} onClick={this.props.onLinkClick}>
        {children}
      </Link>
    )
  }
}

HelpPageContent.propTypes = {
  page: PropTypes.string.isRequired,
  onLinkClick: PropTypes.func,
}

export default HelpPageContent
