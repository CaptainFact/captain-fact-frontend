import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import { facebookAuthUrl } from '../../lib/third_party_auth'
import { deleteAccount } from '../../state/users/current_user/effects'
import { addModal } from '../../state/modals/reducer'
import DeleteUserModal from './DeleteUserModal'
import EditUserForm from './EditUserForm'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Button from '../Utils/Button'
import ThirdPartyAccountLinker from './ThirdPartyAccountLinker'
import LanguageSelector from '../App/LanguageSelector'
import i18n from '../../i18n/i18n'

const mapStateToProps = state => ({
  user: state.CurrentUser.data,
  isLoading: state.CurrentUser.isLoading || state.CurrentUser.isPosting,
  locale: state.UserPreferences.locale
})

const mapDispatchToProps = { deleteAccount, addModal }

@connect(
  mapStateToProps,
  mapDispatchToProps
)
@withNamespaces('user')
export default class UserSettings extends React.PureComponent {
  render() {
    const { t, deleteAccount, addModal, user, locale } = this.props

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
          <LanguageSelector
            className="hide-when-collapsed"
            handleChange={v => i18n.changeLanguage(v)}
            value={i18n.language}
            size="medium"
            withIcon
          />
        </div>
        <br />
        <hr />
        <br />
        <div className="has-text-centered">
          <h3 className="title is-3">{t('linkedAccounts')}</h3>
          <ThirdPartyAccountLinker
            provider="facebook"
            title="Facebook"
            isLinked={!!user.fb_user_id}
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
                props: { handleConfirm: () => deleteAccount() }
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
