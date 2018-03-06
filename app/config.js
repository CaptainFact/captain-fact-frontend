import envConfig from './lib/config.jsenv'

export const JS_ENV =       envConfig.JS_ENV
export const HTTP_API_URL = envConfig.HTTP_API_URL || 'http://test'
export const WS_API_URL =   envConfig.WS_API_URL
export const FRONTEND_URL = envConfig.FRONTEND_URL
export const FB_APP_ID =    envConfig.FB_APP_ID