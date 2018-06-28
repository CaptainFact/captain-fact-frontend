import React from 'react'
import { translate } from 'react-i18next'
import { withRouter } from 'react-router'

import ThirdPartyServiceButton from './ThirdPartyServiceButton'
import {facebookAuthUrl} from '../../lib/third_party_auth'


const ThirdPartyAuthList = ({t, location: {query: {invitation_token}}}) => (
  <div className="third-party-auth">
    <h4 className="title is-4">{t('actionWithThirdParty')}</h4>
    <div className="services-list">
      <ul>
        <li style={{width: '6rem', display: 'inline-block'}}>
          <ThirdPartyServiceButton url={facebookAuthUrl(invitation_token || '')} icon="facebook" label={t('Login with Facebook')} />
        </li>
        <li style={{width: '6rem', display: 'inline-block'}}>
          <ThirdPartyServiceButton url="http://google.com" icon="google" label={t('Login with Google+')} disabled/>
        </li>
        <li style={{width: '6rem', display: 'inline-block'}}>
          <ThirdPartyServiceButton url="http://github.com" icon="github" label={t('Login with Github')} disabled/>
        </li>
        <li style={{width: '6rem', display: 'inline-block'}}>
          <ThirdPartyServiceButton url="http://twitter.com" icon="twitter" label={t('Login with Twitter')} disabled/>
        </li>
      </ul>
    </div>
  </div>
)

export default translate('user')(withRouter(ThirdPartyAuthList))
