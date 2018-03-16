export const getVideoDebateSpeakers = state =>
  state.VideoDebate.video.data.speakers

export const isLoadingVideoDebate = state =>
  state.VideoDebate.video.isLoading || state.VideoDebate.statements.isLoading ||
  state.VideoDebate.comments.isLoading