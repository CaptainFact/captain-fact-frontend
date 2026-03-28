import { gql, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { Edit } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

import FieldWithButton from '../FormUtils/FieldWithButton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Separator } from '../ui/separator'

const editVideoMutation = gql`
  mutation editVideo($id: ID!, $unlisted: Boolean!) {
    editVideo(id: $id, unlisted: $unlisted) {
      id
      unlisted
    }
  }
`

const shiftStatementsMutation = gql`
  mutation shiftStatements($videoId: ID!, $youtubeOffset: Int!) {
    shiftStatements(videoId: $videoId, youtubeOffset: $youtubeOffset) {
      id
      youtubeId
      youtubeOffset
    }
  }
`

const EditVideoModal = ({ open, onOpenChange, video }) => {
  const { t } = useTranslation(['videoDebate', 'main'])
  const [editVideo] = useMutation(editVideoMutation)
  const [shiftStatements] = useMutation(shiftStatementsMutation)

  if (!video) {
    return null
  }

  const unlistedOptions = [
    { value: true, label: t('main:videos.unlisted') },
    { value: false, label: t('main:videos.public') },
  ]

  const renderTitle = () => (
    <div className="flex gap-2 items-center dark:text-foreground">
      <Edit size="1em" /> {t('video.edit')}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{renderTitle()}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <h3 className="mb-2 text-[15px] font-bold dark:text-foreground">Change visibility</h3>
          <Formik
            initialValues={{ unlisted: video.unlisted }}
            enableReinitialize
            onSubmit={async (values) => {
              try {
                await editVideo({
                  variables: { id: video.id, unlisted: values.unlisted },
                })
                toast({ description: 'Visibility changed' })
                window.location.reload()
              } catch (e) {
                console.error(e) // eslint-disable-line no-console
                toast({
                  variant: 'error',
                  description: 'Failed to change visibility',
                })
              }
            }}
          >
            {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
              <form onSubmit={handleSubmit}>
                <Select
                  value={String(values.unlisted)}
                  disabled={isSubmitting}
                  onValueChange={(value) => {
                    setFieldValue('unlisted', value === 'true')
                    handleSubmit()
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {unlistedOptions.map((option) => (
                      <SelectItem key={String(option.value)} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </form>
            )}
          </Formik>
        </div>
        {video.youtubeId && (
          <React.Fragment>
            <Separator className="my-4" />
            <div className="flex flex-col">
              <h3 className="mb-2 text-[15px] font-bold dark:text-foreground">
                {t('video.shiftStatements')}
              </h3>
              <Formik
                initialValues={{ youtubeOffset: video.youtubeOffset }}
                onSubmit={async (values, { setSubmitting }) => {
                  setSubmitting(true)
                  try {
                    await shiftStatements({
                      variables: {
                        videoId: video.id,
                        youtubeOffset: values.youtubeOffset,
                      },
                    })
                    toast({ description: 'Statements shifted successfully' })
                  } catch (e) {
                    console.error(e) // eslint-disable-line no-console
                    toast({
                      variant: 'error',
                      description: 'Failed to shift statements',
                    })
                  }
                  setSubmitting(false)
                  onOpenChange(false)
                }}
              >
                {({ handleSubmit, isSubmitting, values, handleChange }) => (
                  <form onSubmit={handleSubmit}>
                    <FieldWithButton
                      type="number"
                      input={{
                        name: 'youtubeOffset',
                        max: '10000000',
                        value: values.youtubeOffset,
                        onChange: handleChange,
                      }}
                      meta={{ submitting: isSubmitting }}
                      placeholder="+0s"
                      buttonLabel="Shift"
                      buttonClickHandler={handleSubmit}
                    />
                  </form>
                )}
              </Formik>
            </div>
          </React.Fragment>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EditVideoModal
