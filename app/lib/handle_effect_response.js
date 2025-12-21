export const handleEffectResponse =
  ({ onSuccess, onError }) =>
  (action) => {
    if (action) {
      if (onError && action.error) {
        onError(action.payload)
      } else if (onSuccess && !action.error) {
        onSuccess(action.payload)
      }
    }
    return action
  }
