export const videoURL = videoHashID => {
  return `/videos/${videoHashID}`
}

export const videoHistoryURL = videoHashID => {
  return `${videoURL(videoHashID)}/history`
}

export const statementURL = (videoHashID, statementID) => {
  return `${videoURL(videoHashID)}?statement=${statementID}`
}

export const commentURL = (videoHashID, statementID, commentID) => {
  return `${statementURL(videoHashID, statementID)}&c=${commentID}`
}

export const speakerURL = speakerIDOrSlug => `/s/${speakerIDOrSlug}`
