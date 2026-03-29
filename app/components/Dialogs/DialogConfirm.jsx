import isPromise from 'is-promise'
import { Ban } from 'lucide-react'
import React, { useState } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { handleEffectResponse } from '../../lib/handle_effect_response'
import { Button } from '../ui/button'

export const DialogConfirm = ({
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
  open,
  onOpenChange,
  ...props
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (v) => {
    const promise = handleConfirm(v)
    if (isPromise(promise)) {
      setIsSubmitting(true)
      return promise.then(
        handleEffectResponse({
          onSuccess: () => {
            // In controlled mode, let the parent handle closing
            if (onOpenChange) {
              onOpenChange(false)
            }
          },
          onError: () => setIsSubmitting(false),
        }),
      )
    }
  }

  const handleClose = () => {
    if (handleAbort) {
      handleAbort()
    }

    if (onOpenChange) {
      onOpenChange(false)
    }
  }

  const alertDialogProps =
    open !== undefined
      ? { open, onOpenChange: handleClose }
      : { open: true, onOpenChange: handleClose }

  return (
    <AlertDialog {...alertDialogProps} {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {message && <AlertDialogDescription>{message}</AlertDialogDescription>}
        </AlertDialogHeader>
        {content && <div>{content}</div>}
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
