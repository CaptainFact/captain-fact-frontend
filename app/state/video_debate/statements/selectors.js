import { createSelector } from 'reselect'

import { STATEMENT_FOCUS_TIME } from '../../../constants'

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
  },
)
