import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { Flag, TriangleAlert } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { toastError } from '@/lib/toasts'

import { FLAG_COMMENT_MUTATION } from '../../API/graphql_queries'
import { useLoggedInUser } from '../LoggedInUser/UserProvider'
import FlagReasonSelect from '../Moderation/FlagReasonSelect'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Separator } from '../ui/separator'
import Message from '../Utils/Message'
import CommentDisplayV2 from './CommentDisplay'

const ModalFlag = ({ initialReason, comment, open, onOpenChange }) => {
  const { t } = useTranslation('videoDebate')
  const { t: tMain } = useTranslation('main')
  const { loggedInUser, loading: userLoading } = useLoggedInUser()
  const [flagComment, { loading: flaggingLoading }] = useMutation(FLAG_COMMENT_MUTATION)

  const handleSubmit = async (values) => {
    try {
      await flagComment({
        variables: {
          commentId: comment.id,
          reason: parseInt(values.reason, 10),
        },
      })
    } catch (error) {
      toastError(error)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const flagsAvailable = loggedInUser?.available_flags ?? 0
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
          {({ handleSubmit, values, isValid }) => (
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
                <CommentDisplayV2 comment={comment} withoutActions hideThread />
                <Separator className="my-4" />
                <FlagReasonSelect />
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
