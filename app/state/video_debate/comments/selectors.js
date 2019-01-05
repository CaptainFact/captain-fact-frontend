import { List } from 'immutable'
import createCachedSelector from 're-reselect'

const EMPTY_COMMENTS_LIST = new List()

export const getAllComments = state => state.VideoDebate.comments.comments

export const getStatementAllComments = (state, props) => {
  return getAllComments(state).get(props.statement.id, EMPTY_COMMENTS_LIST)
}

export const classifyComments = createCachedSelector(
  getStatementAllComments,
  (state, props) => props.statement.speaker_id,
  (comments, speakerId) => {
    const selfComments = []
    const approvingFacts = []
    const refutingFacts = []
    const regularComments = []

    for (const comment of comments) {
      if (isSelfComment(comment, speakerId)) selfComments.push(comment)
      else if (!comment.source || comment.approve === null) regularComments.push(comment)
      else if (comment.approve) approvingFacts.push(comment)
      else refutingFacts.push(comment)
    }
    return {
      regularComments: new List(regularComments),
      selfComments: new List(selfComments),
      approvingFacts: new List(approvingFacts),
      refutingFacts: new List(refutingFacts)
    }
  }
)((state, props) => props.statement.id)

// ---- Private ----
function isSelfComment({ user }, speakerId) {
  return user && user.speaker_id && user.speaker_id === speakerId
}
