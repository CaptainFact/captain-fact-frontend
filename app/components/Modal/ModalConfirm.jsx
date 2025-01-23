import isPromise from 'is-promise'
import { Ban } from 'lucide-react'
import React, { useState } from 'react'
import { connect } from 'react-redux'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { handleEffectResponse } from '../../lib/handle_effect_response'
import { popModal } from '../../state/modals/reducer'
import { Button } from '../ui/button'

const BaseModalConfirm = ({
  title,
  content,
  message,
  handleConfirm,
  handleAbort,
  confirmIcon = null,
  confirmText,
  abortIcon = <Ban size="1em" />,
  abortText,
  confirmDisabled,
  popModal,
  ...props
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (v) => {
    const promise = handleConfirm(v)
    if (isPromise(promise)) {
      setIsSubmitting(true)
      return promise.then(
        handleEffectResponse({
          onSuccess: () => popModal(),
          onError: () => setIsSubmitting(false),
        }),
      )
    }
  }

  const handleClose = () => {
    if (handleAbort) {
      handleAbort()
    }
    popModal()
  }

  return (
    <AlertDialog open {...props} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        {content && <AlertDialogDescription>{content}</AlertDialogDescription>}
        <AlertDialogFooter>
          <div className="flex gap-2 justify-end w-full">
            <Button
              variant="destructive"
              disabled={isSubmitting || confirmDisabled}
              onClick={handleSubmit}
            >
              {confirmIcon}
              <span>{confirmText}</span>
            </Button>
            <Button variant="outline" disabled={isSubmitting} onClick={handleClose}>
              {abortIcon}
              <span>{abortText}</span>
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const ModalConfirm = connect(null, { popModal })(BaseModalConfirm)
