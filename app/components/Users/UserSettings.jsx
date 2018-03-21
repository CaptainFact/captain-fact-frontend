import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import { facebookAuthUrl } from '../../lib/third_party_auth'
import {deleteAccount, unlinkProvider} from '../../state/users/current_user/effects'
import { addModal } from '../../state/modals/reducer'
import DeleteUserModal from './DeleteUserModal'
import EditUserForm from './EditUserForm'
import { LoadingFrame } from '../Utils/LoadingFrame'


@connect(null, {unlinkProvider})
@translate('user')
class ThirdPartyAccountLinker extends React.PureComponent {
  render() {
    return (
      <p className="field has-addons" style={{width: 200, margin: 'auto'}}>
        <div className="control">
          <div className="linked-account-title">
            {this.props.title}
          </div>
        </div>
        <div className="control">
          {this.props.isLinked ? this.renderUnlinkAccount() : this.renderLinkAccount()}
        </div>
      </p>
    )
  }

  renderLinkAccount() {
    return (
      <a type="submit" className="button" href={this.props.authUrl}>
        {this.props.t('linkAccount')}
      </a>
    )
  }

  renderUnlinkAccount() {
    return (
      <button type="submit" className="button is-danger" onClick={() => this.props.unlinkProvider(this.props.provider)}>
        {this.props.t('unlinkAccount')}
      </button>
    )
  }
}

@connect(state =>
  ({user: state.CurrentUser.data, isLoading: state.CurrentUser.isLoading || state.CurrentUser.isPosting}),
  {deleteAccount, addModal}
)
@translate('user')
export default class UserSettings extends React.PureComponent {
  render() {
    if (this.props.isLoading)
      return <LoadingFrame/>
    return (
      <div>
        <EditUserForm/>
        <hr/>
        <div className="has-text-centered">
          <h3 className="title is-3">{this.props.t('linkedAccounts')}</h3>
          <div className="container">
            <ThirdPartyAccountLinker provider="facebook" title="Facebook" isLinked={!!this.props.user.fb_user_id}
                                     authUrl={facebookAuthUrl()}/>
          </div>
        </div>
        <hr/>
        <div className="has-text-centered">
          <h3 className="title is-3">{this.props.t('dangerZone')}</h3>
          <button className="button is-danger" onClick={() => this.props.addModal({
            Modal: DeleteUserModal,
            props: { handleConfirm: () => this.props.deleteAccount() }
          })}>{this.props.t('deleteAccount')}</button>
        </div>
      </div>
    )
  }
}
