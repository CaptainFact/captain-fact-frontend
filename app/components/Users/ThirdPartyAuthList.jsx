import React from "react"

import ThirdPartyServiceButton from "./ThirdPartyServiceButton"
import { FRONTEND_URL, FB_APP_ID } from '../../config.jsenv'
import { translate } from 'react-i18next'
import { withRouter } from 'react-router'


const optionsToString = (options) => (
  Object.entries(options)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
)

const facebookAuthUrl = location => {
  let queryParams = ''
  if (location.query.invitation_token)
    queryParams = `?invitation_token=${location.query.invitation_token}`
  const options = {
    client_id: FB_APP_ID,
    redirect_uri: `${FRONTEND_URL}/login/callback/facebook${queryParams}`,
    response_type: 'code',
    scope: "email,public_profile"
    //TODO: add state
  }
  return `https://www.facebook.com/v2.8/dialog/oauth?${optionsToString(options)}`
}

const ThirdPartyAuthList = ({t, location}) => (
  <div className="third-party-auth">
    <h4 className="title is-4">{t('actionWithThirdParty')}</h4>
    <div className="services-list">
      <ThirdPartyServiceButton url={facebookAuthUrl(location)} icon="facebook-official"/>
      <ThirdPartyServiceButton url="facebook.com" icon="google" className="is-disabled"/>
      <ThirdPartyServiceButton url="facebook.com" icon="github-square" className="is-disabled"/>
      <ThirdPartyServiceButton url="facebook.com" icon="twitter-square" className="is-disabled"/>
    </div>
  </div>
)

export default translate('user')(withRouter(ThirdPartyAuthList))
