export const isAuthenticated = state => !!state.CurrentUser.data.id

export const hasReputation = (state, neededRep) => 
  isAuthenticated(state) && state.CurrentUser.data.reputation >= neededRep
