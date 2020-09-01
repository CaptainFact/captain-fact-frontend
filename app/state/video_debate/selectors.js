export const getVideoDebateSpeakers = (state) => {
  return state.VideoDebate.video.data.speakers
}

export const isLoadingVideoDebate = (state) => {
  return (
    state.VideoDebate.video.isLoading ||
    state.VideoDebate.statements.isLoading ||
    state.VideoDebate.comments.isLoading
  )
}
