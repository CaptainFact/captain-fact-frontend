import React from 'react'
import { withNamespaces } from 'react-i18next'
import { withRouter } from 'react-router'

import ThirdPartyServiceButton from './ThirdPartyServiceButton'
import { facebookAuthUrl } from '../../lib/third_party_auth'

const ThirdPartyAuthList = ({
  t,
  location: {
    query: { invitation_token }
  }
}) => (
  <div className="third-party-auth">
    <h4 className="title is-4">{t('actionWithThirdParty')}</h4>
    <div className="services-list">
      <ThirdPartyServiceButton
        url={facebookAuthUrl(invitation_token || '')}
        icon="facebook"
      />
    </div>
  </div>
)

export default withNamespaces('user')(withRouter(ThirdPartyAuthList))
