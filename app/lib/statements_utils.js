import { CONFIRMED_STATEMENT_MIN_VOTES } from '../constants'

export const isStatementConfirmed = (comments) => {
  const globalStatementScore = comments.reduce((score, comment) => {
    if (comment.approve === true) {
      // Comments with negative score are ignored to avoid trolls
      return score + Math.max(comment.score, 0)
    }
    if (comment.approve === false) {
      return score - Math.max(comment.score, 0)
    }

    // `comment.approve` is null if comment is not confirming/refuting
    return score
  }, 0)

  if (!globalStatementScore) {
    return null
  } else if (globalStatementScore >= CONFIRMED_STATEMENT_MIN_VOTES) {
    return true
  } else if (globalStatementScore <= -CONFIRMED_STATEMENT_MIN_VOTES) {
    return false
  }
  return null
}
