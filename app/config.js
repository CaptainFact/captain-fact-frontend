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

// Get the CF global config
const globals = window.CF_GLOBALS || {}

// Raw env export
export const JS_ENV = globals['JS_ENV'] || process.env.JS_ENV
export const HTTP_API_URL = globals['HTTP_API_URL'] || process.env.HTTP_API_URL
export const WS_API_URL = globals['WS_API_URL'] || process.env.WS_API_URL
export const GRAPHQL_API_URL = globals['GRAPHQL_API_URL'] || process.env.GRAPHQL_API_URL
export const FRONTEND_URL = globals['FRONTEND_URL'] || process.env.FRONTEND_URL
export const FB_APP_ID = globals['FB_APP_ID'] || process.env.FB_APP_ID
export const ALGOLIA_APP_ID = globals['ALGOLIA_APP_ID'] || process.env.ALGOLIA_APP_ID
export const ALGOLIA_USAGE_API_KEY =
  globals['ALGOLIA_USAGE_API_KEY'] || process.env.ALGOLIA_USAGE_API_KEY
export const INVITATION_SYSTEM = boolFromConfig(
  globals['INVITATION_SYSTEM'] || process.env.INVITATION_SYSTEM || 'off'
)

// Some helpers based on env
export const IS_DEV = JS_ENV === 'dev'
