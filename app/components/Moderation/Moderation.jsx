import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Report } from 'styled-icons/octicons'

import { toast } from '@/hooks/use-toast'

import { MIN_REPUTATION_MODERATION } from '../../constants'
import { commentURL } from '../../lib/cf_routes'
import { fetchRandomModeration, postModerationFeedback } from '../../state/moderation/effects'
import { Button } from '../ui/button'
import UserAppellation from '../Users/UserAppellation'
import UserAction from '../UsersActions/UserAction'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Message from '../Utils/Message'
import { withReputationGuard } from '../Utils/ReputationGuard'
import { ModerationForm } from './ModerationForm'

@connect(
  (state) => ({
    isLoading: state.Moderation.isLoading,
    error: state.Moderation.error,
    entry: state.Moderation.entry,
  }),
  { fetchRandomModeration, postModerationFeedback },
)
@withTranslation('moderation')
@withReputationGuard(MIN_REPUTATION_MODERATION)
export default class Moderation extends React.PureComponent {
  componentDidMount() {
    this.props.fetchRandomModeration()
  }

  postFeedback(values) {
    this.props
      .postModerationFeedback(values)
      .then(() => {
        toast({
          variant: 'success',
          title: 'Flag submitted',
          description: 'Thank you for your feedback!',
        })
      })
      .then(() => this.props.fetchRandomModeration())
  }

  render() {
    const { entry, t } = this.props

    if (this.props.isLoading) {
      return <LoadingFrame />
    }

    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-6">
          {t('title')} <Report className="inline w-8 h-8" />
        </h1>
        <div className="text-center mb-8">
          <p className="mb-2">{t('helpText1')}</p>
          <p className="mb-4">{t('helpText2')}</p>
          <Link className="font-bold hover:underline" to="/help/moderation">
            {t('learnMore')}
          </Link>
        </div>
        {!entry && <Message className="text-center mt-8">{t('emptyModeration')}</Message>}
        {entry && (
          <div>
            {this.renderAction(entry.action)}
            <hr className="my-6" />
            {entry.flags.map(({ source_user, reason }) => (
              <div key={source_user.id} className="text-center mb-2">
                <UserAppellation user={source_user} /> {t('flaggedFor', { reason })}
              </div>
            ))}
          </div>
        )}
      </main>
    )
  }

  renderAction(action) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <UserAction action={action} defaultExpanded />
        <div className="my-4">
          <div className="bg-gray-50 rounded p-4 text-center">
            <Button variant="outline">
              <Link
                target="_blank"
                to={commentURL(action.videoHashId, action.statementId, action.commentId)}
                className="font-bold hover:underline"
              >
                {this.props.t('seeContext')}
              </Link>
            </Button>
          </div>
        </div>
        <hr className="my-4" />
        <ModerationForm
          action={action}
          initialValues={{ action_id: action.id }}
          onSubmit={(values) => this.postFeedback(values)}
        />
      </div>
    )
  }
}
