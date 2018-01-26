import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import { Link } from 'react-router'

import { isExternal } from '../../lib/url_utils'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { ErrorView } from '../Utils/ErrorView'
import { fetchHelpPage } from '../../state/help/effects'
import { reset } from '../../state/help/reducer'


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
class HelpPageContent extends PureComponent {
  componentDidMount() {
    this.props.fetchHelpPage(this.props.page)
  }

  componentDidUpdate(oldProps) {
    if (this.props.locale !== oldProps.locale)
      this.props.fetchHelpPage(this.props.page)
  }

  componentWillUnmount() {
    this.props.reset()
  }

  render() {
    if (this.props.isLoading)
      return <LoadingFrame/>
    if (this.props.error)
      return <ErrorView canGoBack={false} error={this.props.error}/>
    return <Markdown className="content" source={this.props.markdownContent} renderers={MARKDOWN_RENDERERS}/>
  }
}

HelpPageContent.propTypes = {
  page: PropTypes.string.isRequired
}

export default HelpPageContent
