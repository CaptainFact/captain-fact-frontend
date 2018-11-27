import { Record, Map, List, Set } from 'immutable'
import { createAction, handleActions } from 'redux-actions'
import isAfter from 'date-fns/is_after'

import Comment from './record'
import parseDateTime from '../../../lib/parse_datetime'
import { resetVideoDebate } from '../actions'
import { logWarn } from '../../../logger'

export const addFlag = createAction('COMMENTS/ADD_FLAG')

export const addMyVote = createAction('COMMENTS/ADD_MY_VOTE')
export const setVoting = createAction('COMMENTS/SET_VOTING')
export const endVoting = createAction('COMMENTS/END_VOTING')

export const fetchAll = createAction('COMMENTS/FETCH_ALL')
export const update = createAction('COMMENTS/UPDATE')
export const updateScores = createAction('COMMENTS/UPDATE_SCORES')
export const scoreDiff = createAction('COMMENTS/SCORE_DIFF')
export const setLoading = createAction('COMMENTS/SET_LOADING')
export const remove = createAction('COMMENTS/DELETE')
export const add = createAction('COMMENTS/ADD')

const INITIAL_STATE = new Record({
  isLoading: false,
  errors: null,
  comments: new Map(),
  replies: new Map(),
  selfSourcing: new Map(),
  voted: new Map(),
  voting: new Set(),
  myFlags: new Set()
})

const CommentsReducer = handleActions(
  {
    // Flags
    [addFlag]: (state, { payload }) => state.update('myFlags', f => f.add(payload)),
    // Votes
    [addMyVote]: (state, { payload: { comment, value } }) => {
      return state
        .setIn(['voted', comment.id], value)
        .update('voting', s => s.delete(comment.id))
    },
    [setVoting]: (state, { payload }) => state.update('voting', s => s.add(payload)),
    [endVoting]: (state, { payload }) => state.update('voting', s => s.remove(payload)),
    // Comments
    [setLoading]: (state, { payload }) => state.set('isLoading', payload),
    [fetchAll]: {
      next: (state, { payload: { comments, my_votes, my_flags } }) => {
        const preparedComments = new List(
          comments.map(prepareComment).sort(commentsComparator)
        ).groupBy(c => c.reply_to_id)

        const replies = preparedComments.delete(null)
        const notReplies = preparedComments.get(null) || new List()

        return state.merge({
          comments: notReplies.groupBy(c => c.statement_id),
          errors: null,
          isLoading: false,
          replies,
          voted: !my_votes
            ? new Map()
            : new Map().withMutations(map => {
                return my_votes.forEach(vote => map.set(vote.comment_id, vote.value))
              }),
          myFlags: new Set(my_flags)
        })
      },
      throw: (state, { payload }) => state.merge({ errors: payload, isLoading: false })
    },
    [add]: (state, { payload }) => {
      const comment = prepareComment(payload)
      const commentPath = getCommentPath(comment)
      const commentsList = state.getIn(commentPath, new List())
      const insertIdx = commentsList.findIndex(c => commentsComparator(comment, c) < 0)
      const newCommentsList = commentsList.insert(
        insertIdx !== -1 ? insertIdx : commentsList.size,
        comment
      )
      return state.setIn(commentPath, newCommentsList)
    },
    [update]: (state, { payload }) => {
      const commentFullPath = getCommentFullPath(state, payload)
      if (!commentFullPath) return state
      const comment = payload.__partial ? payload : prepareComment(payload)
      return state.updateIn(commentFullPath, c => c.merge(comment))
    },
    [remove]: (state, { payload }) => {
      const commentFullPath = getCommentFullPath(state, payload)
      if (!commentFullPath) return state
      return state.deleteIn(commentFullPath)
    },
    [updateScores]: (state, { payload }) => {
      // TODO DEPRECATED: Will be removed in 0.9
      const { comments, replies } = new List(payload)
        .groupBy(c => (c.reply_to_id ? 'replies' : 'comments'))
        .toObject()

      // Update comments
      if (comments) {
        const groupedComments = comments.groupBy(c => c.statement_id).entries()
        for (const [statementId, newComments] of groupedComments)
          state = state.updateIn(['comments', statementId], oldList =>
            mergeCommentsList(oldList, newComments)
          )
      }
      // Update replies
      if (replies) {
        const groupedReplies = replies.groupBy(r => r.reply_to_id).entries()
        for (const [commentId, newComments] of groupedReplies)
          state = state.updateIn(['replies', commentId], oldList =>
            mergeCommentsList(oldList, newComments)
          )
      }
      return state
    },
    [scoreDiff]: (state, { payload: { diff, comment } }) => {
      const commentPath = getCommentPath(comment)
      const commentIdx = getCommentIdx(state, commentPath, comment.id)
      if (!commentIdx === -1) {
        logWarn(`New vote registered on unknown comment: ${comment.id}`)
        return state
      }
      return state
        .updateIn([...commentPath, commentIdx, 'score'], s => s + diff)
        .updateIn(commentPath, comments => comments.sort(commentsComparator))
    },
    [resetVideoDebate]: () => INITIAL_STATE()
  },
  INITIAL_STATE()
)

// Sort comments by score. More recents come firsts if same score
function commentsComparator(c1, c2) {
  if (c1.score === c2.score) return isAfter(c1.inserted_at, c2.inserted_at) ? -1 : 1
  return c1.score > c2.score ? -1 : 1
}

function prepareComment(comment) {
  comment.inserted_at = parseDateTime(comment.inserted_at)
  comment.score = comment.score || 0
  return new Comment(comment)
}

function getCommentFullPath(state, comment) {
  const commentPath = getCommentPath(comment)
  const commentIdx = getCommentIdx(state, commentPath, comment.id)
  if (commentIdx === -1) return null
  commentPath.push(commentIdx)
  return commentPath
}

function getCommentPath(comment) {
  return comment.reply_to_id
    ? ['replies', comment.reply_to_id]
    : ['comments', comment.statement_id]
}

function getCommentIdx(state, path, id) {
  return state.getIn(path, new List()).findIndex(c => c.id === id)
}

function mergeCommentsList(_oldList, newList, addNewComments = false) {
  return _oldList
    .withMutations(oldList => {
      for (const comment of newList) {
        const commentIdx = oldList.findIndex(c => c.id === comment.id)
        if (commentIdx !== -1) oldList.update(commentIdx, c => c.merge(comment))
        else if (addNewComments) oldList.push(comment)
      }
      return oldList
    })
    .sort(commentsComparator)
}

export default CommentsReducer
