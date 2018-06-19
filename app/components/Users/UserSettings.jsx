import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import { facebookAuthUrl } from '../../lib/third_party_auth'
import { deleteAccount } from '../../state/users/current_user/effects'
import { resetOnboarding } from '../../state/onboarding/effects'
import { addModal } from '../../state/modals/reducer'
import DeleteUserModal from './DeleteUserModal'
import EditUserForm from './EditUserForm'
import { LoadingFrame } from '../Utils/LoadingFrame'
import ThirdPartyAccountLinker from './ThirdPartyAccountLinker'


@connect(state => ({
  user: state.CurrentUser.data,
  isLoading: state.CurrentUser.isLoading || state.CurrentUser.isPosting
}), {
  deleteAccount, addModal, resetOnboarding
})
@translate('user')
export default class UserSettings extends React.PureComponent {
  render() {
    if (this.props.isLoading)
      return <LoadingFrame/>
    return (
      <div className="section">
        <div className="has-text-centered">
          <h3 className="title is-3">{this.props.t('main:menu.settings')}</h3>
        </div>
        <EditUserForm/>
        <br/>
        <hr/>
        <br/>
        <div className="has-text-centered">
          <h3 className="title is-3">{this.props.t('linkedAccounts')}</h3>
          <ThirdPartyAccountLinker
            provider="facebook"
            title="Facebook"
            isLinked={!!this.props.user.fb_user_id}
            authUrl={facebookAuthUrl()}
          />
        </div>
        <br/>
        <div className="section has-text-centered">
          <h3 className="title is-3">Visite guidée</h3>
          <button className="button" onClick={this.props.resetOnboarding}>
            Réinitialiser
          </button>
        </div>
        <hr/>
        <br/>
        <div className="has-text-centered">
          <h3 className="title is-3">{this.props.t('dangerZone')}</h3>
          <button
            className="button is-danger"
            onClick={() => this.props.addModal({
              Modal: DeleteUserModal,
              props: { handleConfirm: () => this.props.deleteAccount() }
            })}
          >{this.props.t('deleteAccount')}
          </button>
        </div>
      </div>
    )
  }
}
