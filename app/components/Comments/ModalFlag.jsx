import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { Flag, TriangleAlert } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useToast } from '@/hooks/use-toast'
import { toastError } from '@/lib/toasts'

import { FLAG_COMMENT_MUTATION } from '../../API/graphql_queries'
import { logWarn } from '../../logger'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import FlagReasonSelect from '../Moderation/FlagReasonSelect'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Separator } from '../ui/separator'
import Message from '../Utils/Message'
import CommentDisplay from './CommentDisplay'

const ModalFlag = ({ initialReason, comment, open, onOpenChange, onFlagSuccess }) => {
  const { t } = useTranslation('videoDebate')
  const { t: tMain } = useTranslation('main')
  const { loggedInUser, loading: userLoading } = useLoggedInUser()
  const [flagComment, { loading: flaggingLoading }] = useMutation(FLAG_COMMENT_MUTATION, {
    update: (cache, { data }) => {
      if (data?.flagComment && comment.id) {
        // Update the cache to mark this comment as flagged
        // The flags are stored in loggedInUser.flags as a map
        try {
          cache.modify({
            id: cache.identify({ __typename: 'User', id: loggedInUser?.id }),
            fields: {
              flags(existingFlags = {}) {
                return {
                  ...existingFlags,
                  [comment.id]: true,
                }
              },
            },
          })
        } catch (error) {
          // Cache update might fail, which is fine
          logWarn(`Could not update cache for flagged comment: ${error}`)
        }
      }
    },
  })
  const { toast } = useToast()

  const handleSubmit = async (values) => {
    try {
      await flagComment({
        variables: {
          commentId: comment.id,
          reason: values.reason,
        },
      })

      toast({
        title: t('flagForm.successMessage'),
        variant: 'success',
      })

      // Notify parent component that flag was successful
      if (onFlagSuccess) {
        onFlagSuccess(comment.id)
      }

      onOpenChange(false)
    } catch (error) {
      toastError(error)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const flagsAvailable = loggedInUser?.availableFlags ?? 0
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('flagForm.title')}</DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{ reason: initialReason || '' }}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleSubmit, values, isValid, setFieldValue }) => (
            <>
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-4">
                  <Message type="warning">
                    <div className="flex items-center">
                      <div className="mr-2">
                        <TriangleAlert size={40} className="text-yellow-500" />
                      </div>
                      <div>
                        <p>{t('flagForm.warningMessage1')}</p>
                        <p>{t('flagForm.warningMessage2')}</p>
                        <p>{t('flagForm.warningMessage3')}</p>
                      </div>
                    </div>
                  </Message>
                </div>
                <CommentDisplay comment={comment} withoutActions hideThread />
                <Separator className="my-4" />
                <FlagReasonSelect onChange={(value) => setFieldValue('reason', value)} />
              </form>

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

export default ModalFlag
