import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { ListTodo, LogIn, MessageSquare, X } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/css-utils'

import { MIN_REPUTATION_START_AUTOMATIC_STATEMENTS_EXTRACTION } from '../../constants'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'

const startAutomaticStatementsExtractionMutation = gql`
  mutation StartAutomaticStatementsExtraction($videoId: ID!) {
    startAutomaticStatementsExtraction(videoId: $videoId) {
      id
    }
  }
`

const ActionBubbleMenuV2 = ({
  video,
  hasStatementForm,
  hasStatements,
  onSetStatementForm,
  onClearStatementForm,
  t,
  isAuthenticated,
  loggedInUser,
}) => {
  const history = useHistory()
  const [hasCalledStatementsExtract, setHasCalledStatementsExtract] = React.useState(false)
  const [startAutomaticStatementsExtraction, { loading }] = useMutation(
    startAutomaticStatementsExtractionMutation,
  )

  const onStatementBubbleClick = () => {
    if (hasStatementForm) {
      onClearStatementForm()
    } else {
      const subPathRegex = new RegExp('/videos/(.+)/(captions|transcript)/?')
      const match = subPathRegex.exec(location.pathname)
      if (match) {
        history.push(`/videos/${match[1]}`)
      }

      onSetStatementForm({ speakerId: 0 })
    }
  }

  const handleAutomaticExtraction = async () => {
    if (!video?.id) {
      return
    }
    try {
      setHasCalledStatementsExtract(true)
      await startAutomaticStatementsExtraction({ variables: { videoId: video.id } })
      toast({
        description: t('videoDebate:statement.automaticExtractionSuccess'),
      })
    } catch (e) {
      setHasCalledStatementsExtract(true)
      toast({ variant: 'destructive', description: t('errors:server.unknown') })
    }
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 items-center right-6 flex flex-col-reverse z-50 transition-all duration-300',
        {
          '-bottom-24 opacity-0': false, // hidden prop can be added later
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
            onClick={onStatementBubbleClick}
            primary
          />
          {!hasStatements &&
            loggedInUser?.reputation >= MIN_REPUTATION_START_AUTOMATIC_STATEMENTS_EXTRACTION && (
              <ActionBubble
                disabled={loading || hasCalledStatementsExtract}
                loading={loading}
                icon={ListTodo}
                label={t('statement.startAutomaticExtraction')}
                onClick={handleAutomaticExtraction}
              />
            )}
        </React.Fragment>
      ) : (
        <ActionBubble
          icon={LogIn}
          label={t('main:menu.signup')}
          onClick={() => history.push('/signup')}
          primary
        />
      )}
    </div>
  )
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
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        props.onClick?.()
      }
    }}
    data-cy="action-bubble"
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

export default withTranslation('videoDebate')(withLoggedInUser(ActionBubbleMenuV2))
