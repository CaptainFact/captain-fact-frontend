function boolFromConfig(value) {
  const lowerValue = value && value.toLowerCase()
  if (['on', 'enabled', '1', 'true', 'yes'].includes(lowerValue)) {
    return true
  }
  if (['off', 'disabled', '0', 'false', 'no'].includes(lowerValue)) {
    return false
  }
  console.error(`Unknown config value ${value}`)
  return false
}

export const JS_ENV = process.env.JS_ENV
export const HTTP_API_URL = process.env.HTTP_API_URL
export const WS_API_URL = process.env.WS_API_URL
export const FRONTEND_URL = process.env.FRONTEND_URL
export const FB_APP_ID = process.env.FB_APP_ID
export const INVITATION_SYSTEM = boolFromConfig(process.env.INVITATION_SYSTEM)
