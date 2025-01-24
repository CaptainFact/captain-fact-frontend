import { Mutation } from '@apollo/client/react/components'
import gql from 'graphql-tag'
import { ListTodo, LogIn, MessageSquare, X } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/css-utils'

import { MIN_REPUTATION_START_AUTOMATIC_STATEMENTS_EXTRACTION } from '../../constants'
import { destroyStatementForm } from '../../state/video_debate/statements/effects'
import { changeStatementForm } from '../../state/video_debate/statements/reducer'
import { hasStatementForm } from '../../state/video_debate/statements/selectors'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'

const startAutomaticStatementsExtractionMutation = gql`
  mutation StartAutomaticStatementsExtraction($videoId: Int!) {
    startAutomaticStatementsExtraction(videoId: $videoId) {
      id
    }
  }
`

@connect(
  (state) => ({
    hasAutoscroll: state.UserPreferences.enableAutoscroll,
    soundOnBackgroundFocus: state.UserPreferences.enableSoundOnBackgroundFocus,
    hasStatementForm: hasStatementForm(state),
    hasStatements: state.VideoDebate.statements.data.size > 0,
    videoId: state.VideoDebate.video.data.id,
  }),
  {
    changeStatementForm,
    destroyStatementForm,
  },
)
@withTranslation('videoDebate')
@withRouter
@withLoggedInUser
export default class ActionBubbleMenu extends React.PureComponent {
  state = {
    hasCalledStatementsExtract: false,
  }

  render() {
    const {
      t,
      hasStatementForm,
      isAuthenticated,
      hidden,
      customActions,
      loggedInUser,
      hasStatements,
      videoId,
    } = this.props
    return (
      <div
        className={cn(
          'fixed bottom-6 items-center right-6 flex flex-col-reverse z-50 transition-all duration-300',
          {
            '-bottom-24 opacity-0': hidden,
            group: !hasStatementForm,
          },
        )}
      >
        {isAuthenticated ? (
          <React.Fragment>
            <ActionBubble
              icon={hasStatementForm ? X : MessageSquare}
              label={t(hasStatementForm ? 'statement.abortAdd' : 'statement.add')}
              activated={!hasStatementForm}
              onClick={() => !hidden && this.onStatementBubbleClick()}
              primary
            />
            {!hasStatements &&
              loggedInUser.reputation >= MIN_REPUTATION_START_AUTOMATIC_STATEMENTS_EXTRACTION && (
                <Mutation mutation={startAutomaticStatementsExtractionMutation}>
                  {(startAutomaticStatementsExtraction, { loading }) => (
                    <ActionBubble
                      disabled={loading || this.state.hasCalledStatementsExtract}
                      loading={loading}
                      icon={ListTodo}
                      label={t('statement.startAutomaticExtraction')}
                      onClick={async () => {
                        try {
                          this.setState({ hasCalledStatementsExtract: true })
                          await startAutomaticStatementsExtraction({ variables: { videoId } })
                          toast({
                            description: t('videoDebate:statement.automaticExtractionSuccess'),
                          })
                        } catch (e) {
                          this.setState({ hasCalledStatementsExtract: true })
                          toast({ variant: 'destructive', description: t('errors:server.unknown') })
                        }
                      }}
                    />
                  )}
                </Mutation>
              )}
            {customActions || null}
          </React.Fragment>
        ) : (
          <ActionBubble
            icon={LogIn}
            label={t('main:menu.signup')}
            onClick={() => this.props.history.push('/signup')}
            primary
          />
        )}
      </div>
    )
  }

  onStatementBubbleClick() {
    if (this.props.hasStatementForm) {
      this.props.destroyStatementForm()
    } else {
      const subPathRegex = new RegExp('/videos/(.+)/(captions|transcript)/?')
      const match = subPathRegex.exec(location.pathname)
      if (match) {
        this.props.history.push(`/videos/${match[1]}`)
      }

      const values = this.props.getStatementInitialValues?.() || {}
      this.props.changeStatementForm({ speaker_id: 0, ...values })
    }
  }
}

export const ActionBubble = ({
  icon: Icon,
  label,
  activated = true,
  loading = false,
  primary = false,
  disabled,
  ...props
}) => (
  <div
    className={cn(
      'mb-2 first:mb-0 transition-all duration-300',
      'cursor-pointer shadow-md hover:shadow-lg right-0',
      'group-hover:opacity-100 group-hover:translate-y-0',
      'relative flex items-center justify-center rounded-full',

      {
        'w-16 h-16': primary,
        'w-12 h-12 translate-y-2 opacity-0': !primary,
        'bg-gray-300': !activated,
        'bg-primary hover:bg-primary/80': activated,
        'pointer-events-none opacity-50': disabled,
      },
    )}
    {...props}
  >
    <div className="absolute right-full mr-2 hidden whitespace-nowrap rounded bg-gray-800/80 px-3 py-1 text-sm text-white group-hover:block">
      {label}
    </div>
    {loading ? (
      <div className="flex items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    ) : (
      <Icon className="text-white" size={primary ? 32 : 24} />
    )}
  </div>
)
