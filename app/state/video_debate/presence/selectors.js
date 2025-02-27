import { createSelector } from 'reselect'

const videoDebatePresence = (state) => state.VideoDebate.presence

export const videoDebateOnlineUsersCount = createSelector(
  videoDebatePresence,
  (presence) => presence.users.count,
)

export const videoDebateOnlineViewersCount = createSelector(
  videoDebatePresence,
  (presence) => presence.viewers.count,
)
