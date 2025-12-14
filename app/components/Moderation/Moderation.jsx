import { useLazyQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Report } from 'styled-icons/octicons'

import { toast } from '@/hooks/use-toast'

import { RANDOM_MODERATION_QUERY } from '../../API/graphql_queries'
import { MIN_REPUTATION_MODERATION } from '../../constants'
import { commentURL } from '../../lib/cf_routes'
import { Button } from '../ui/button'
import UserAppellation from '../Users/UserAppellation'
import UserAction from '../UsersActions/UserAction'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Message from '../Utils/Message'
import ReputationGuard from '../Utils/ReputationGuard'
import ModerationForm from './ModerationForm'

const Moderation = () => {
  const { t } = useTranslation('moderation')
  const [fetchRandomModeration, { data, loading, refetch }] = useLazyQuery(RANDOM_MODERATION_QUERY)

  useEffect(() => {
    fetchRandomModeration()
  }, [fetchRandomModeration])

  const postFeedback = () => {
    toast({
      variant: 'success',
      title: 'Flag submitted',
      description: 'Thank you for your feedback!',
    })
    refetch()
  }

  const renderAction = (action) => (
    <div className="bg-white dark:bg-background rounded-lg shadow-md dark:shadow-xl p-6">
      <UserAction action={action} defaultExpanded />
      <div className="my-4">
        <div className="bg-gray-50 dark:bg-accent rounded p-4 text-center">
          <Button variant="outline">
            <Link
              target="_blank"
              to={commentURL(action.videoHashId, action.statementId, action.commentId)}
              className="font-bold hover:underline dark:text-foreground"
            >
              {t('seeContext')}
            </Link>
          </Button>
        </div>
      </div>
      <hr className="my-4 dark:border-border" />
      <ModerationForm action={action} onSubmit={postFeedback} />
    </div>
  )

  if (loading) {
    return <LoadingFrame />
  }

  const entry = data?.randomModeration

  return (
    <ReputationGuard requiredRep={MIN_REPUTATION_MODERATION}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-6 dark:text-foreground">
          {t('title')} <Report className="inline w-8 h-8" />
        </h1>
        <div className="text-center mb-8">
          <p className="mb-2 dark:text-foreground">{t('helpText1')}</p>
          <p className="mb-4 dark:text-foreground">{t('helpText2')}</p>
          <Link
            className="font-bold hover:underline dark:text-foreground dark:hover:text-primary"
            to="/help/moderation"
          >
            {t('learnMore')}
          </Link>
        </div>
        {!entry && <Message className="text-center mt-8">{t('emptyModeration')}</Message>}
        {entry && (
          <div>
            {renderAction(entry.action)}
            <hr className="my-6 dark:border-border" />
            {entry.flags.map(({ sourceUser, reason }) => (
              <div key={sourceUser.id} className="text-center mb-2 dark:text-foreground">
                <UserAppellation user={sourceUser} /> {t('flaggedFor', { reason })}
              </div>
            ))}
          </div>
        )}
      </main>
    </ReputationGuard>
  )
}

export default Moderation
