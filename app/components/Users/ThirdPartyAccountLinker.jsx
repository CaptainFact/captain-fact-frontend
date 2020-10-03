import React from 'react'
import { withNamespaces } from 'react-i18next'

import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { unlinkProvider } from '../../API/http_api/current_user'
import Button from '../Utils/Button'

const ThirdPartyAccountLinker = ({ t, title, updateLoggedInUser, provider, isLinked, authURL }) => (
  <div className="field has-addons" style={{ width: 200, margin: 'auto' }}>
    <div className="control">
      <div className="linked-account-title">{title}</div>
    </div>
    <div className="control">
      {isLinked ? (
        <Button
          type="submit"
          className="is-danger"
          onClick={() => {
            return unlinkProvider(provider).then((user) => {
              updateLoggedInUser(user)
            })
          }}
        >
          {t('unlinkAccount')}
        </Button>
      ) : (
        <a type="submit" className="button" href={authURL}>
          {t('linkAccount')}
        </a>
      )}
    </div>
  </div>
)

export default withNamespaces('user')(withLoggedInUser(ThirdPartyAccountLinker))
