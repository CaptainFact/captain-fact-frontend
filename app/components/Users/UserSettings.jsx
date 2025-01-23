import { CircleAlert } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { deleteUserAccount } from '../../API/http_api/current_user'
import { addModal, popModal } from '../../state/modals/reducer'
import UserLanguageSelector from '../LoggedInUser/UserLanguageSelector'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { LoadingFrame } from '../Utils/LoadingFrame'
import DeleteUserModal from './DeleteUserModal'
import EditUserForm from './EditUserForm'

@connect((state) => ({ locale: state.UserPreferences.locale }), { addModal, popModal })
@withTranslation('user')
@withLoggedInUser
export default class UserSettings extends React.PureComponent {
  render() {
    const { t, addModal, logout } = this.props
    return this.props.isLoading ? (
      <LoadingFrame />
    ) : (
      <div data-cy="user-settings" className="p-6">
        <Card className="mt-6 p-6 mx-auto max-w-[500px]">
          <h3 className="text-2xl font-semibold mb-4">{t('main:menu.language')}</h3>
          <UserLanguageSelector />
        </Card>

        <Card className="mt-6 p-6 mx-auto max-w-[500px]">
          <h3 className="text-2xl font-semibold mb-4">{t('accountSettings')}</h3>
          <EditUserForm />
        </Card>

        <Separator className="my-12 mx-auto max-w-[540px]" />

        <Card className="mt-6 p-6 mx-auto max-w-[500px]">
          <h3 className="text-2xl font-semibold mb-4 text-red-500 flex items-center">
            <CircleAlert size="0.9em" className="mr-2" />
            {t('dangerZone')}
          </h3>
          <Button
            variant="destructive"
            className="w-full"
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
        </Card>
      </div>
    )
  }
}
