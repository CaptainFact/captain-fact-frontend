import React from 'react'

import DeleteUserModal from './DeleteUserModal'
import { translate } from 'react-i18next'
import { deleteAccount } from '../../state/users/current_user/effects'
import { connect } from 'react-redux'
import { addModal } from '../../state/modals/reducer'
import EditUserForm from './EditUserForm'


@connect(null, {deleteAccount, addModal})
@translate('user')
export default class UserSettings extends React.PureComponent {
  render() {
    return (
      <div>
        {/*<div className="has-text-centered">*/}
        {/*TODO  <h3 className="title is-3">Linked accounts</h3>*/}
        {/*</div>*/}
        {/*<hr/>*/}
        <EditUserForm/>
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
