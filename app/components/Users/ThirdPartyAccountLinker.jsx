import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import {unlinkProvider} from '../../state/users/current_user/effects'
import Button from '../Utils/Button'


const mapDispatchToProps = {unlinkProvider}

const ThirdPartyAccountLinker = ({
  t,
  unlinkProvider,
  title,
  provider,
  isLinked,
  authURL
}) => (
  <div className="field has-addons" style={{width: 200, margin: 'auto'}}>
    <div className="control">
      <div className="linked-account-title">
        {title}
      </div>
    </div>
    <div className="control">
      {isLinked ? (
        <Button
          type="submit"
          className="is-danger"
          onClick={() => unlinkProvider(provider)}
        >
          {t('unlinkAccount')}
        </Button>
      ) : (
        <a type="submit" className="button" href={authURL}>
          {t('linkAccount')}
        </a>
      )
      }
    </div>
  </div>
)

export default translate('user')(
  connect(null, mapDispatchToProps)(ThirdPartyAccountLinker)
)
