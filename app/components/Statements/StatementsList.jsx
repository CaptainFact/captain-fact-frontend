import React, { useMemo } from 'react'
import FlipMove from 'react-flip-move'
import { withTranslation } from 'react-i18next'

import { FULLHD_WIDTH_THRESHOLD } from '../../constants'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import StatementContainerV2 from './StatementContainer'
import StatementFormV2 from './StatementForm'

const StatementsListV2 = ({
  statements,
  speakers,
  statementForm,
  offset,
  onSetStatementForm,
  onClearStatementForm,
  onSetScrollTo,
  videoId,
  votesMap,
  isAuthenticated,
  t,
}) => {
  // Filter statements based on authentication
  const filteredStatements = useMemo(() => {
    if (!statements) {
      return []
    }
    if (!isAuthenticated) {
      return statements.filter((s) => !s.isDraft)
    }
    return statements
  }, [statements, isAuthenticated])

  // Get speaker ID for form
  const speakerId = useMemo(() => {
    if (statementForm?.speakerId !== undefined) {
      return statementForm.speakerId
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
              speakerId: speakerId,
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
              votesMap={votesMap}
              onSetScrollTo={onSetScrollTo}
            />
          </div>
        ))}
      </FlipMove>
    </div>
  )
}

export default withTranslation('videoDebate')(withLoggedInUser(StatementsListV2))
