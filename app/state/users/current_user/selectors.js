export const isAuthenticated = state => !!state.CurrentUser.data.id

export const isPublisher = state => state.CurrentUser.data.is_publisher

export const userReputation = state => state.CurrentUser.data.reputation

export const hasReputation = (state, neededRep) => isAuthenticated(state)
  && (isPublisher(state) || userReputation(state) >= neededRep)
