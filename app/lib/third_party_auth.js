import { FRONTEND_URL, FB_APP_ID } from '../config'
import { optionsToQueryString } from './url_utils'

export const facebookAuthUrl = callbackOptions =>
  `https://www.facebook.com/v2.8/dialog/oauth${optionsToQueryString({
    client_id: FB_APP_ID,
    redirect_uri: `${FRONTEND_URL}/login/callback/facebook`,
    response_type: 'code',
    scope: 'email,public_profile',
    state: callbackOptions
  })}`
