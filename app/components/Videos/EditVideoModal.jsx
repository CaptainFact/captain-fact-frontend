import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import { Edit } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

import { shiftStatements } from '../../state/video_debate/effects'
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

const EditVideoModal = ({ open, onOpenChange, video, shiftStatements }) => {
  const { t } = useTranslation(['videoDebate', 'main'])
  const [editVideo] = useMutation(editVideoMutation)

  if (!video) {return null}

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
                initialValues={{ youtube_offset: video.youtube_offset }}
                onSubmit={async (values, { setSubmitting }) => {
                  setSubmitting(true)
                  if (shiftStatements) {
                    await shiftStatements(values)
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
                        name: 'youtube_offset',
                        max: '10000000',
                        value: values.youtube_offset,
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
