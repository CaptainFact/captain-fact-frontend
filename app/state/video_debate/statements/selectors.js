import createCachedSelector from 're-reselect'
import { formValueSelector } from 'redux-form'
import { createSelector } from 'reselect'

import { STATEMENT_FOCUS_TIME } from '../../../constants'
import { getVideoDebateSpeakers } from '../selectors'

export const getStatementSpeakerId = (state, props) => props.statement.speaker_id

export const getStatementSpeaker = createCachedSelector(
  getStatementSpeakerId,
  getVideoDebateSpeakers,
  (speakerId, speakers) => speakers.find((s) => s.id === speakerId)
)((state, props) => props.statement.id)

export const getFocusedStatementId = createSelector(
  (state) => state.VideoDebate.statements.data,
  (state) => state.VideoDebate.video.playback.position,
  (state) => state.VideoDebate.video.offset,
  (statements, position, offset) => {
    if (!position) {
      return -1
    }
    const adjustedPosition = position - offset
    const statement = statements.findLast((st) => adjustedPosition >= st.time)
    return statement && adjustedPosition <= statement.time + STATEMENT_FOCUS_TIME
      ? statement.id
      : -1
  }
)

export const getFocusedStatementSpeakerId = createSelector(
  (state) => state.VideoDebate.statements.data,
  getFocusedStatementId,
  (statements, focusId) => {
    if (focusId === -1) {
      return null
    }
    const statement = statements.find((s) => s.id === focusId)
    return (statement && statement.speaker_id) || null
  }
)

export const isStatementFocused = createSelector(
  getFocusedStatementId,
  (state, props) => props.statement.id,
  (focusedStatementId, statementId) => focusedStatementId === statementId
)

export const statementFormValueSelector = formValueSelector('StatementForm')

export const hasStatementForm = (state) => {
  return statementFormValueSelector(state, 'speaker_id') !== undefined
}
