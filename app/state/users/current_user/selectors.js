export const isAuthenticated = state => !!state.CurrentUser.data.id
export const isAuthenticating = state => state.CurrentUser.isLoading
