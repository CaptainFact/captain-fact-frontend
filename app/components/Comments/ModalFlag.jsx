import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { Flag } from 'lucide-react'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { FLAG_COMMENT_MUTATION } from '../../API/graphql_queries'
import { popModal } from '../../state/modals/reducer'
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
import FlagForm from './FlagForm'

const ModalFlag = ({
  comment,
  initialReason,
  open,
  onOpenChange,
  onSuccess,
  handleConfirm,
  handleAbort,
  popModal
}) => {
  const { t } = useTranslation('videoDebate')
  const { t: tMain } = useTranslation('main')
  const { user, loading: userLoading } = useLoggedInUser()
  const [flagComment, { loading: flaggingLoading }] = useMutation(FLAG_COMMENT_MUTATION)

  // Determine if we're using controlled mode or legacy Redux mode
  const isControlled = open !== undefined && onOpenChange

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await flagComment({
        variables: {
          commentId: comment.id,
          reason: parseInt(values.reason, 10),
        },
      })
      resetForm()

      // Handle success based on modal pattern
      if (isControlled) {
        onOpenChange(false)
        if (onSuccess) {
          onSuccess()
        }
      } else {
        // Legacy Redux mode - call handleConfirm with the reason
        if (handleConfirm) {
          await handleConfirm({ reason: values.reason })
        }
        popModal()
      }
    } catch (error) {
      console.error('Error flagging comment:', error)
    }
  }

  const flagsAvailable = user?.availableFlags ?? 0

  const handleClose = () => {
    if (isControlled) {
      onOpenChange(false)
    } else {
      // Legacy Redux mode
      if (handleAbort) {
        handleAbort()
      }
      popModal()
    }
  }

  const dialogProps = isControlled
    ? { open, onOpenChange: handleClose }
    : { open: true, onOpenChange: handleClose }

  return (
    <Dialog {...dialogProps}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('flagForm.title')}</DialogTitle>
          <DialogDescription>{t('flagForm.description')}</DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{ reason: initialReason || '' }}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleSubmit, values, isValid }) => (
            <>
              <FlagForm comment={comment} />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={flaggingLoading}
                >
                  {tMain('actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  onClick={handleSubmit}
                  disabled={
                    userLoading || flaggingLoading || !flagsAvailable || !values.reason || !isValid
                  }
                  loading={flaggingLoading}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  <span>
                    {tMain('actions.flag')}
                    {flagsAvailable === -1 ? null : (
                      <small className="ml-1">
                        ({t('flagForm.xAvailable', { count: flagsAvailable })})
                      </small>
                    )}
                  </span>
                </Button>
              </DialogFooter>
            </>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default connect(null, { popModal })(ModalFlag)
