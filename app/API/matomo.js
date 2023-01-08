import { IS_DEV } from '../config'

/**
 * Low-level function to push an event to matomo **only** if instanciated. If
 * Matomo is not instanciated (which is, if `window._paq` is undefined) the event
 * is simply ignored.
 *
 * @param {string} context The context where this happens (eg. Home, UserProfile...)
 * @param {string} action The type of action (Click, Close...)
 * @param {string} (optional) name
 * @param {number} (optional) numeric value
 */
export const pushEvent = (context, action, name, value) => {
  try {
    // Generate the event
    let event = null
    if (name && value) {
      event = ['trackEvent', context, action, name, value]
    } else if (name) {
      event = ['trackEvent', context, action, name]
    } else {
      event = ['trackEvent', context, action]
    }

    // Push the event
    if ((window._paq === undefined || !window._paq) && IS_DEV) {
      // eslint-disable-next-line no-console
      console.debug('[Matomo] Push event', event)
    } else {
      window._paq.push(event)
    }
  } catch (e) {
    // Ignore errors
  }
  return true
}

/**
 * Register a click on Matomo.
 *
 * @param {string} context The context where this happens (eg. Home, UserProfile...)
 * @param {string} type of the element (eg. Link, Button)
 * @param {string} name The name of the link / button (eg. signin, register...)
 */
export const registerClick = (context, type, name) => {
  return pushEvent(context, 'Click', `${type}-${name}`)
}
