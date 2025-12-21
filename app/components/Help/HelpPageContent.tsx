/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/heading-has-content */

import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { Link } from 'react-router-dom'
import remarkGfm from 'remark-gfm'

import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { isDownloadableFile, isExternal } from '../../lib/url_utils'
import { ErrorView } from '../Utils/ErrorView'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { LoadingFrame } from '../Utils/LoadingFrame'

const ERROR_NOT_FOUND = 'not_found'

const HelpPageContent = ({ page, onLinkClick }: { page: string; onLinkClick: () => void }) => {
  const { locale } = useUserPreferences()
  const [markdownContent, setMarkdownContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHelpPage = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/assets/help/${locale}/${page}.md`)
        const contentType = response.headers.get('Content-Type')

        if (contentType && !contentType.includes('markdown')) {
          throw ERROR_NOT_FOUND
        }

        if (response.status === 200 || response.status === 304) {
          const text = await response.text()
          setMarkdownContent(text)
          setIsLoading(false)
        } else if (response.status === 404) {
          setError(ERROR_NOT_FOUND)
          setIsLoading(false)
        } else {
          throw new Error('Cannot fetch help page')
        }
      } catch (err) {
        setError(err)
        setIsLoading(false)
      }
    }

    fetchHelpPage()
  }, [locale, page])

  if (isLoading) {
    return <LoadingFrame />
  }

  if (error) {
    return <ErrorView canGoBack={false} error={error} />
  }

  return (
    <Markdown
      className="content"
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (props) => (
          <h1
            className="text-4xl mb-8 mt-12 text-gray-800 dark:text-foreground font-bold"
            {...props}
          />
        ),
        h2: (props) => (
          <h2
            className="text-3xl font-bold mt-8 mb-6 text-gray-700 dark:text-foreground"
            {...props}
          />
        ),
        h3: (props) => (
          <h3
            className="text-2xl font-bold mb-4 mt-6 text-gray-600 dark:text-foreground"
            {...props}
          />
        ),
        h4: (props) => (
          <h4
            className="text-xl mb-4 mt-6 text-gray-600 dark:text-foreground font-semibold"
            {...props}
          />
        ),
        p: (props) => (
          <p
            className="text-lg leading-relaxed text-gray-600 dark:text-foreground my-6"
            {...props}
          />
        ),
        ul: (props) => (
          <ul
            className="list-disc list-outside ml-6 mb-6 space-y-2 text-gray-600 dark:text-foreground"
            {...props}
          />
        ),
        ol: (props) => (
          <ol
            className="list-decimal list-outside ml-6 mb-6 space-y-2 text-gray-600 dark:text-foreground"
            {...props}
          />
        ),
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        li: ({ node, ...props }) => <li className="leading-relaxed mb-2" {...props} />,
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        blockquote: ({ node, ...props }) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { ref: _ref, ...restProps } =
            props as React.ComponentPropsWithoutRef<'blockquote'> & { ref?: React.Ref<HTMLElement> }
          return (
            <blockquote
              className="border-l-4 border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-gray-600 dark:text-foreground px-6 py-1 mb-6 rounded-r italic leading-relaxed"
              {...restProps}
            />
          )
        },
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        code: ({ node, className, children, ...props }) => {
          if (typeof children === 'string' && children.length < 30) {
            return (
              <code
                className="bg-gray-100 dark:bg-accent text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            )
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { ref: _ref, ...restProps } =
            props as React.ComponentPropsWithoutRef<'blockquote'> & { ref?: React.Ref<HTMLElement> }
          return (
            <blockquote
              className="border-l-4 border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-gray-600 dark:text-foreground px-6 py-3 mb-6 rounded-r italic leading-relaxed"
              {...restProps}
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
            <Link className="underline" to={href} onClick={onLinkClick} {...props} />
          ),
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto mb-6">
            <table
              className="min-w-full border-collapse bg-white dark:bg-background shadow-sm dark:shadow-md rounded-lg"
              {...props}
            />
          </div>
        ),
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        thead: ({ node, ...props }) => (
          <thead
            className="bg-gray-50 dark:bg-accent border-b border-gray-200 dark:border-border"
            {...props}
          />
        ),
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        tr: ({ node, ...props }) => (
          <tr
            className="border-b border-gray-100 dark:border-border hover:bg-gray-50 dark:hover:bg-accent transition-colors duration-150"
            {...props}
          />
        ),
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        th: ({ node, ...props }) => (
          <th className="p-3 font-medium text-left text-gray-700 dark:text-foreground" {...props} />
        ),
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        td: ({ node, ...props }) => (
          <td className="p-3 text-gray-600 dark:text-foreground" {...props} />
        ),
      }}
    >
      {markdownContent}
    </Markdown>
  )
}

export default HelpPageContent
