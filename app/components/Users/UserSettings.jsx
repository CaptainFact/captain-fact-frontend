import { Flex } from '@rebass/grid'
import React from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'

import { deleteUserAccount } from '../../API/http_api/current_user'
import { facebookAuthUrl } from '../../lib/third_party_auth'
import { addModal, popModal } from '../../state/modals/reducer'
import UserLanguageSelector from '../LoggedInUser/UserLanguageSelector'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import Button from '../Utils/Button'
import { LoadingFrame } from '../Utils/LoadingFrame'
import DeleteUserModal from './DeleteUserModal'
import EditUserForm from './EditUserForm'
import ThirdPartyAccountLinker from './ThirdPartyAccountLinker'

@connect((state) => ({ locale: state.UserPreferences.locale }), { addModal, popModal })
@withNamespaces('user')
@withLoggedInUser
export default class UserSettings extends React.PureComponent {
  render() {
    const { t, addModal, loggedInUser, locale, logout } = this.props
    return this.props.isLoading ? (
      <LoadingFrame />
    ) : (
      <div className="section">
        <div className="has-text-centered">
          <h3 className="title is-3">{t('accountSettings')}</h3>
        </div>
        <EditUserForm />
        <br />
        <hr />
        <div className="has-text-centered">
          <h3 className="title is-3">{t('main:menu.language')}</h3>
          <Flex justifyContent="center">
            <UserLanguageSelector />
          </Flex>
        </div>
        <br />
        <hr />
        <br />
        <div className="has-text-centered">
          <h3 className="title is-3">{t('linkedAccounts')}</h3>
          <ThirdPartyAccountLinker
            provider="facebook"
            title="Facebook"
            isLinked={!!loggedInUser.fb_user_id}
            authURL={facebookAuthUrl()}
          />
        </div>
        <br />
        <hr />
        <br />
        <div className="has-text-centered">
          <h3 className="title is-3">{t('browsingAnalyzer')}</h3>
          <iframe
            title="Matomo opt-out"
            style={{ border: 0, height: 175, width: 600 }}
            src={`https://stats.captainfact.io/index.php?module=CoreAdminHome&action=optOut&language=${locale}&fontFamily=Ubuntu`}
          />
        </div>
        <br />
        <hr />
        <br />
        <div className="has-text-centered">
          <h3 className="title is-3">{t('dangerZone')}</h3>
          <Button
            className="is-danger"
            onClick={() =>
              addModal({
                Modal: DeleteUserModal,
                props: {
                  handleConfirm: () => {
                    return deleteUserAccount().then(() => {
                      logout()
                      this.props.popModal()
                    })
                  },
                },
              })
            }
          >
            {t('deleteAccount')}
          </Button>
        </div>
      </div>
    )
  }
}
