import React, { useEffect, useMemo } from 'react'
import FlipMove from 'react-flip-move'
import { withTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { FULLHD_WIDTH_THRESHOLD } from '../../../constants'
import { withLoggedInUser } from '../../LoggedInUser/UserProvider'
import StatementContainerV2 from './StatementContainerV2'
import StatementFormV2 from './StatementFormV2'

const StatementsListV2 = ({
  statements,
  speakers,
  statementForm,
  scrollTo,
  offset,
  onSetStatementForm,
  onClearStatementForm,
  onSetScrollTo,
  videoId,
  votesMap,
  isAuthenticated,
  t,
}) => {
  const location = useLocation()

  // Handle URL query parameter for scrolling to statement
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.has('statement')) {
      onSetScrollTo({
        id: parseInt(searchParams.get('statement')),
        __forceAutoScroll: true,
      })
    }
  }, [location.search, onSetScrollTo])

  // Filter statements based on authentication
  const filteredStatements = useMemo(() => {
    if (!statements) {return []}
    if (!isAuthenticated) {
      return statements.filter((s) => !s.isDraft)
    }
    return statements
  }, [statements, isAuthenticated])

  // Get speaker ID for form
  const speakerId = useMemo(() => {
    if (statementForm?.speaker_id !== undefined) {
      return statementForm.speaker_id
    }
    if (speakers && speakers.length === 1) {
      return speakers[0].id
    }
    return null
  }, [statementForm, speakers])

  return (
    <div>
      {statementForm !== null && (
        <div className="mb-4 max-w-[980px] mx-auto">
          <StatementFormV2
            offset={offset}
            initialValues={{
              speaker_id: speakerId,
              text: statementForm.text || '',
              time: statementForm.time,
            }}
            speakers={speakers || []}
            onAbort={onClearStatementForm}
            onSuccess={onClearStatementForm}
            onSetScrollTo={onSetScrollTo}
            videoId={videoId}
          />
        </div>
      )}
      <FlipMove
        enterAnimation="fade"
        disableAllAnimations={window.innerWidth < FULLHD_WIDTH_THRESHOLD}
        className="flex flex-col gap-8"
      >
        {filteredStatements.map((statement) => (
          <div key={statement.id}>
            <StatementContainerV2
              statement={statement}
              speakers={speakers || []}
              offset={offset}
              scrollTo={scrollTo}
              onSetScrollTo={onSetScrollTo}
              votesMap={votesMap}
            />
          </div>
        ))}
      </FlipMove>
    </div>
  )
}

export default withTranslation('videoDebate')(withLoggedInUser(StatementsListV2))
