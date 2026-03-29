/**
 * Classify comments for a statement
 * @param {Array} comments - Array of comment objects
 * @param {number} speakerId - Speaker ID for the statement
 * @returns {Object} Classified comments
 */
export const classifyComments = (comments, speakerId) => {
  if (!comments || !Array.isArray(comments)) {
    return {
      regularComments: [],
      selfComments: [],
      approvingFacts: [],
      refutingFacts: [],
    }
  }

  const selfComments = []
  const approvingFacts = []
  const refutingFacts = []
  const regularComments = []

  for (const comment of comments) {
    if (isSelfComment(comment, speakerId)) {
      selfComments.push(comment)
    } else if (!comment.source || comment.approve === null) {
      regularComments.push(comment)
    } else if (comment.approve) {
      approvingFacts.push(comment)
    } else {
      refutingFacts.push(comment)
    }
  }

  return {
    regularComments,
    selfComments,
    approvingFacts,
    refutingFacts,
  }
}

function isSelfComment(comment, speakerId) {
  return comment.user && comment.user.speakerId && comment.user.speakerId === speakerId
}
