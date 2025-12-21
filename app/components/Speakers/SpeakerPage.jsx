import { useQuery } from '@apollo/client'
import { ExternalLink } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { useHistory, useLocation, useParams } from 'react-router-dom'

import { SPEAKER_QUERY } from '../../API/graphql_queries'
import { FRONTEND_URL } from '../../config'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { LOCAL_STORAGE_KEYS } from '../../lib/local_storage'
import { Button } from '../ui/button'
import DismissableMessage from '../Utils/DismissableMessage'
import { ErrorView } from '../Utils/ErrorView'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { LoadingFrame } from '../Utils/LoadingFrame'
import PaginatedVideosContainer from '../Videos/PaginatedVideosContainer'
import SpeakerPreviewV2 from './SpeakerPreview'

const SpeakerPage = ({ t }) => {
  const { slug_or_id } = useParams()
  const history = useHistory()
  const location = useLocation()
  const { locale: userLocale } = useUserPreferences()

  // Parse slug_or_id to determine if it's an ID or slug
  const isNumeric = /^\d+$/.test(slug_or_id)
  const variables = isNumeric ? { id: slug_or_id } : { slug: slug_or_id }

  const {
    data,
    loading: speakerLoading,
    error,
  } = useQuery(SPEAKER_QUERY, {
    variables,
    skip: !slug_or_id,
  })

  const [wikiLinks, setWikiLinks] = useState({
    wikimedia: null,
    wikipedia: null,
    wikiquote: null,
    wikinews: null,
  })
  const [wikiLoading, setWikiLoading] = useState(false)

  const speaker = data?.speaker

  useEffect(() => {
    if (speaker?.wikidataItemId && userLocale) {
      fetchWikiData(speaker.wikidataItemId, userLocale)
    }
  }, [speaker?.wikidataItemId, userLocale])

  useEffect(() => {
    // Replace id by slug in URL if necessary
    if (!speakerLoading && speaker?.slug && speaker.slug !== slug_or_id) {
      history.replace(`/s/${speaker.slug}`)
    }
  }, [speakerLoading, speaker?.slug, slug_or_id, history])

  const fetchWikiData = (wikidataId, locale = 'en') => {
    setWikiLoading(true)
    const url = `https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=SELECT%20%3Fsitelink%20WHERE%20%7B%0A%20%20BIND(wd%3A${wikidataId}%20AS%20%3Fperson)%0A%20%20%3Fsitelink%20schema%3Aabout%20%3Fperson%20.%20%3Fsitelink%20schema%3AinLanguage%20%22${locale}%22%0A%7D`
    fetch(url)
      .then((r) => r.text())
      .then((xml) => {
        const parser = new DOMParser()
        const res = parser.parseFromString(xml, 'text/xml')
        const links = Array.from(res.getElementsByTagName('uri')).map((e) => e.textContent)
        const allLinks = {}
        const supportedSites = ['wikimedia', 'wikipedia', 'wikiquote', 'wikinews']
        for (const link of links) {
          const siteName = supportedSites.find((site) => link.includes(site))
          if (siteName) {
            allLinks[siteName] = link
          }
        }
        setWikiLinks(allLinks)
        setWikiLoading(false)
      })
      .catch(() => {
        setWikiLoading(false)
      })
  }

  const getCanonicalUrl = () => {
    // Get slug or ID
    let slugOrId = slug_or_id
    if (speaker) {
      slugOrId = speaker.slug || speaker.id
    }

    // Add pagination
    const searchParams = new URLSearchParams(location.search)
    const currentPage = parseInt(searchParams.get('page')) || 1
    const url = new URL(`${FRONTEND_URL}/s/${slugOrId}`)
    if (currentPage > 1) {
      url.searchParams.set('page', currentPage)
    }

    return url.href
  }

  const renderWikidata = () => {
    if (wikiLoading) {
      return '...'
    }
    return renderLink(wikiLinks.wikipedia, 'Wikipedia')
  }

  const renderVideos = () => {
    if (speakerLoading || !speaker) {
      return <LoadingFrame />
    }

    const searchParams = new URLSearchParams(location.search)
    const currentPage = parseInt(searchParams.get('page')) || 1
    return (
      <PaginatedVideosContainer
        baseURL={location.pathname}
        currentPage={currentPage}
        speakerID={speaker.id}
      />
    )
  }

  const renderLink = (url, siteName) => {
    if (!url) {
      return null
    }
    return (
      <Button variant="outline">
        <ExternalLinkNewTab href={url} className="flex items-center gap-2">
          <ExternalLink size="1em" /> <span>{siteName}</span>
        </ExternalLinkNewTab>
      </Button>
    )
  }

  if (error) {
    return <ErrorView error={error} />
  }

  if (!speaker && !speakerLoading) {
    return <ErrorView error={{ status: 404, message: 'Speaker not found' }} />
  }

  const title = speaker ? `${t('speakerpage.title1')} ${speaker.fullName}` : t('speakerpage.title1')

  return (
    <div className="speaker-page">
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={speaker?.title || ''} />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href={getCanonicalUrl()} />
      </Helmet>
      <div className="bg-gray-100 dark:bg-[hsl(0,0%,14%)] py-8">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 dark:text-foreground">
            <span className="text-[1.8rem]">{t('speakerpage.title1')}</span>{' '}
            <div className="mt-3">
              {speaker && <SpeakerPreviewV2 withoutActions speaker={speaker} />}
            </div>
          </h1>
          <hr className="my-4 border-t border-gray-200 dark:border-border" />
          <div className="text-lg text-gray-600 dark:text-muted-foreground">{renderWikidata()}</div>
        </div>
      </div>
      <div className="flex justify-center my-6">
        <DismissableMessage
          localStorageDismissKey={LOCAL_STORAGE_KEYS.DISMISS_SPEAKER_INTRODUCTION}
          className="max-w-3xl mx-4"
        >
          <strong className="block mb-2 dark:text-foreground">{t('speakerpage.info1')}</strong>
          <p className="mb-4 dark:text-foreground">
            {t('speakerpage.info2')}{' '}
            <ExternalLinkNewTab
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {t('speakerpage.more')}
            </ExternalLinkNewTab>
          </p>
        </DismissableMessage>
      </div>
      <div className="container mx-auto px-4">{renderVideos()}</div>
    </div>
  )
}

export default withTranslation('main')(SpeakerPage)
