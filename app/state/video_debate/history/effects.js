import { toastError } from '@/lib/toasts'

import { SocketApi } from '../../../API'
import {
  ACTION_DELETE,
  ACTION_REMOVE,
  ENTITY_SPEAKER,
  STATEMENTS_HISTORY_CHANNEL,
  VIDEO_DEBATE_HISTORY_CHANNEL,
} from '../../../constants'
import { getEntityIDFromAction } from '../../../lib/user_action_entity_id'
import { addAction, fetchAll } from '../../user_actions/reducer'

export const joinVideoDebateHistoryChannel = (videoId) => (dispatch) =>
  joinHistoryChannel(
    dispatch,
    VIDEO_DEBATE_HISTORY_CHANNEL,
    `${VIDEO_DEBATE_HISTORY_CHANNEL}:${videoId}`,
  )

export const leaveVideoDebateHistoryChannel = () => () =>
  SocketApi.leaveChannel(VIDEO_DEBATE_HISTORY_CHANNEL)

export const joinStatementHistoryChannel = (statementId) => (dispatch) =>
  joinHistoryChannel(
    dispatch,
    STATEMENTS_HISTORY_CHANNEL,
    `${STATEMENTS_HISTORY_CHANNEL}:${statementId}`,
  )

export const leaveStatementHistoryChannel = () => () =>
  SocketApi.leaveChannel(STATEMENTS_HISTORY_CHANNEL)

export const revertVideoDebateUserAction = (action) => () => {
  if (action.type !== ACTION_DELETE && action.type !== ACTION_REMOVE) {
    return
  }
  const msg = action.entity === ENTITY_SPEAKER ? 'restore_speaker' : 'restore_statement'
  return SocketApi.push(VIDEO_DEBATE_HISTORY_CHANNEL, msg, {
    id: getEntityIDFromAction(action),
  }).catch((e) => toastError(e))
}

function joinHistoryChannel(dispatch, channelId, topic) {
  // Connect to channel
  dispatch(
    fetchAll(
      SocketApi.joinChannel(channelId, topic, {
        action_added: (a) => dispatch(addAction(a)),
      }),
    ),
  )
}
