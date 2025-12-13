import { CircleAlert } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import UserLanguageSelector from '../LoggedInUser/UserLanguageSelector'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { LoadingFrame } from '../Utils/LoadingFrame'
import DeleteUserModal from './DeleteUserModal'
import EditUserForm from './EditUserForm'

const UserSettings = () => {
  const { t } = useTranslation('user')
  const { loggedInUserLoading, logout } = useLoggedInUser()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const handleDeleteSuccess = () => {
    logout()
  }

  return loggedInUserLoading ? (
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
        <Button variant="destructive" className="w-full" onClick={() => setDeleteModalOpen(true)}>
          {t('deleteAccount')}
        </Button>
      </Card>

      <DeleteUserModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}

const UserSettingsWithPreferences = (props) => {
  const { locale } = useUserPreferences()
  return <UserSettings {...props} locale={locale} />
}

export default UserSettingsWithPreferences
