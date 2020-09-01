import { SocketApi } from '../../../API'
import { COMMENTS_CHANNEL } from '../../../constants'
import {
  add,
  remove,
  fetchAll,
  update,
  setLoading,
  setVoting,
  addMyVote,
  endVoting,
  addFlag,
  updateScores,
  scoreDiff,
} from './reducer'
import { createEffect, generateFSAError } from '../../utils'
import { errorToFlash } from '../../flashes/reducer'

export const joinCommentsChannel = (videoId) => (dispatch) => {
  // Connect to channel
  dispatch(setLoading(true))
  dispatch(
    fetchAll(
      SocketApi.joinChannel(COMMENTS_CHANNEL, `comments:video:${videoId}`, {
        comment_removed: (c) => dispatch(remove(c)),
        comment_added: (c) => dispatch(add(c)),
        comment_score_diff: (p) => dispatch(scoreDiff(p)),
        comment_updated: (c) => dispatch(update(c)),
        comments_scores_updated: ({ comments }) => dispatch(updateScores(comments)),
      })
    )
  )
}

export const leaveCommentsChannel = () => () => {
  return SocketApi.leaveChannel(COMMENTS_CHANNEL)
}

export const postComment = (comment) => {
  return createEffect(SocketApi.push(COMMENTS_CHANNEL, 'new_comment', comment), {
    catch: generateFSAError,
  })
}

export const deleteComment = ({ id }) => {
  return createEffect(SocketApi.push(COMMENTS_CHANNEL, 'delete_comment', { id }), {
    catch: errorToFlash,
  })
}

export const commentVote = (params) =>
  createEffect(
    SocketApi.push(COMMENTS_CHANNEL, 'vote', {
      comment_id: params.comment.id,
      value: params.value,
    }),
    {
      before: setVoting(params.comment.id),
      then: addMyVote(params),
      catch: [endVoting(params.comment.id), errorToFlash],
    }
  )

export const flagComment = ({ id, reason }) => {
  return createEffect(SocketApi.push(COMMENTS_CHANNEL, 'flag_comment', { id, reason }), {
    then: addFlag(id),
    catch: errorToFlash,
  })
}
