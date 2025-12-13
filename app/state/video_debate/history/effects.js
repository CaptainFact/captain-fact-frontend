import { SocketApi } from '../../../API'
import { STATEMENTS_HISTORY_CHANNEL } from '../../../constants'
import { addAction, fetchAll } from '../../user_actions/reducer'

export const joinStatementHistoryChannel = (statementId) => (dispatch) =>
  joinHistoryChannel(
    dispatch,
    STATEMENTS_HISTORY_CHANNEL,
    `${STATEMENTS_HISTORY_CHANNEL}:${statementId}`,
  )

export const leaveStatementHistoryChannel = () => () =>
  SocketApi.leaveChannel(STATEMENTS_HISTORY_CHANNEL)

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
