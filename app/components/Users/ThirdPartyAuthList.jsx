import React from 'react'
import { withNamespaces } from 'react-i18next'
import { withRouter } from 'react-router-dom'

import { facebookAuthUrl } from '../../lib/third_party_auth'
import ThirdPartyServiceButton from './ThirdPartyServiceButton'

const ThirdPartyAuthList = ({ t }) => (
  <div className="third-party-auth">
    <h4 className="title is-4">{t('actionWithThirdParty')}</h4>
    <div className="services-list">
      <ThirdPartyServiceButton url={facebookAuthUrl('')} icon="facebook" />
    </div>
  </div>
)

export default withNamespaces('user')(withRouter(ThirdPartyAuthList))
