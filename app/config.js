import envConfig from './lib/config.jsenv'

export const JS_ENV =       envConfig.JS_ENV
export const HTTP_API_URL = envConfig.HTTP_API_URL || 'http://127.0.0.1:4000'
export const WS_API_URL =   envConfig.WS_API_URL || 'ws://localhost:4000/socket'
export const FRONTEND_URL = envConfig.FRONTEND_URL || 'http://localhost:3333'
export const FB_APP_ID =    envConfig.FB_APP_ID || '506726596325615'