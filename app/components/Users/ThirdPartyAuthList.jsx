import React from "react"
import { translate } from 'react-i18next'
import { withRouter } from 'react-router'

import ThirdPartyServiceButton from "./ThirdPartyServiceButton"
import {facebookAuthUrl} from '../../lib/third_party_auth'


const ThirdPartyAuthList = ({t, location: {query: {invitation_token}}}) => (
  <div className="third-party-auth">
    <h4 className="title is-4">{t('actionWithThirdParty')}</h4>
    <div className="services-list">
      <ThirdPartyServiceButton url={facebookAuthUrl(invitation_token ? {invitation_token} : null)} icon="facebook-official"/>
      <ThirdPartyServiceButton url="facebook.com" icon="google" className="is-disabled"/>
      <ThirdPartyServiceButton url="facebook.com" icon="github-square" className="is-disabled"/>
      <ThirdPartyServiceButton url="facebook.com" icon="twitter-square" className="is-disabled"/>
    </div>
  </div>
)

export default translate('user')(withRouter(ThirdPartyAuthList))
