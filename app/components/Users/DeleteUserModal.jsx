import { useFormik } from 'formik'
import { AlertTriangle } from 'lucide-react'
import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { deleteUserAccount } from '../../API/http_api/current_user'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'

const DeleteUserModal = ({ open, onOpenChange, onSuccess }) => {
  const { t } = useTranslation('user')
  const { loggedInUser } = useLoggedInUser()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formik = useFormik({
    initialValues: {
      usernameConfirm: '',
    },
    validate: (values) => {
      const errors = {}
      if (values.usernameConfirm !== loggedInUser.username) {
        errors.usernameConfirm = t('user:errors.usernameDoesNotMatch')
      }
      return errors
    },
    onSubmit: async () => {
      setIsSubmitting(true)
      try {
        await deleteUserAccount()
        onOpenChange(false)
        onSuccess?.()
      } catch {
        // Error is handled by the API layer
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
      formik.resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('deleteAccount')}</DialogTitle>
          <DialogDescription>
            <Trans i18nKey="user:deletingAccountDescription">
              Deleting your account will permanently remove all your data
            </Trans>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">
            <Trans i18nKey="user:deletingAccountWill">Deleting your account will...</Trans>
          </h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <Trans i18nKey="user:deleteAllVotes">Delete all your votes</Trans>
            </li>
            <li>
              <Trans i18nKey="user:deleteAllFlags">Delete all your flags</Trans>
            </li>
            <li>
              <Trans i18nKey="user:deleteAllPersonalData">
                Delete all your personal data (email, username...etc)
              </Trans>
            </li>
            <li>
              <Trans i18nKey="user:anonymizeAllComments">Anonymize all your comments</Trans>
            </li>
            <li>
              <Trans i18nKey="user:anonymizeActionsHistory">Anonymize your actions history</Trans>
            </li>
          </ul>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-4 mt-4">
            <Label htmlFor="usernameConfirm" className="text-lg">
              <Trans i18nKey="user:typeUsernameToConfirm">
                Type your username below to confirm the deletion:
              </Trans>
            </Label>
            <Input
              id="usernameConfirm"
              name="usernameConfirm"
              value={formik.values.usernameConfirm}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
              placeholder={t('user:username')}
            />
            {formik.touched.usernameConfirm && formik.errors.usernameConfirm && (
              <p className="text-sm text-destructive">{formik.errors.usernameConfirm}</p>
            )}
          </div>

          <Separator />

          <div className="flex flex-col items-center">
            <AlertTriangle size={24} className="text-destructive" />
            <h2 className="text-2xl font-bold mt-2">
              <Trans i18nKey="user:thisActionIsIrreversible">This action is irreversible</Trans>
            </h2>
          </div>

          <Separator />
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t('main:actions.cancel')}
          </Button>
          <Button
            type="submit"
            variant="destructive"
            onClick={formik.handleSubmit}
            disabled={!formik.isValid || isSubmitting}
            loading={isSubmitting}
          >
            {t('main:actions.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteUserModal
