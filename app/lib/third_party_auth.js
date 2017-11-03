import { FRONTEND_URL, FB_APP_ID } from '../config.jsenv'


const optionsToString = (options) => ( options && Object.keys(options).length > 0 ?
  `?${Object.entries(options).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')}` : ''
)

export const facebookAuthUrl = callbackOptions =>
  `https://www.facebook.com/v2.8/dialog/oauth${optionsToString({
    client_id: FB_APP_ID,
    redirect_uri: `${FRONTEND_URL}/login/callback/facebook${optionsToString(callbackOptions)}`,
    response_type: 'code',
    scope: "email,public_profile"
  })}`
