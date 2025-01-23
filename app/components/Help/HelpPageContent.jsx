/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/heading-has-content */
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
      <Markdown
        className="content"
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-4xl mb-8 mt-12 text-gray-800 font-bold" {...props} />,
          h2: (props) => <h2 className="text-3xl font-bold mt-8 mb-6 text-gray-700" {...props} />,
          h3: (props) => <h3 className="text-2xl font-bold mb-4 mt-6 text-gray-600" {...props} />,
          h4: (props) => (
            <h4 className="text-xl mb-4 mt-6 text-gray-600 font-semibold" {...props} />
          ),
          p: (props) => <p className="text-lg leading-relaxed text-gray-600 my-6" {...props} />,
          ul: (props) => (
            <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-gray-600" {...props} />
          ),
          ol: (props) => (
            <ol
              className="list-decimal list-outside ml-6 mb-6 space-y-2 text-gray-600"
              {...props}
            />
          ),
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          li: ({ node, ...props }) => <li className="leading-relaxed mb-2" {...props} />,
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-400 bg-blue-50 text-gray-600 px-6 py-1 mb-6 rounded-r italic leading-relaxed"
              {...props}
            />
          ),
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          code: ({ node, className, children, ...props }) => {
            return typeof children === 'string' && children.length < 30 ? (
              <code
                className="bg-gray-100 text-pink-600 px-2 py-0.5 rounded font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            ) : (
              <blockquote
                className="border-l-4 border-blue-400 bg-blue-50 text-gray-600 px-6 py-3 mb-6 rounded-r italic leading-relaxed"
                {...props}
              >
                {children}
              </blockquote>
            )
          },
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          a: ({ node, href, ...props }) =>
            isExternal(window.location.href, href) || isDownloadableFile(href) ? (
              <ExternalLinkNewTab className="underline" href={href} {...props} />
            ) : (
              <Link className="underline" to={href} onClick={this.props.onLinkClick} {...props} />
            ),
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-6">
              <table
                className="min-w-full border-collapse bg-white shadow-sm rounded-lg"
                {...props}
              />
            </div>
          ),
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-50 border-b border-gray-200" {...props} />
          ),
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          tr: ({ node, ...props }) => (
            <tr
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
              {...props}
            />
          ),
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          th: ({ node, ...props }) => (
            <th className="p-3 font-medium text-left text-gray-700" {...props} />
          ),
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
          td: ({ node, ...props }) => <td className="p-3 text-gray-600" {...props} />,
        }}
      >
        {this.props.markdownContent}
      </Markdown>
    )
  }
}

HelpPageContent.propTypes = {
  page: PropTypes.string.isRequired,
  onLinkClick: PropTypes.func,
}

export default HelpPageContent
