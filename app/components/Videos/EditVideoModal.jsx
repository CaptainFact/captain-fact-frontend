import { Mutation } from '@apollo/client/react/components'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Edit } from 'styled-icons/fa-regular'

import { toast } from '@/hooks/use-toast'

import { popModal } from '../../state/modals/reducer'
import { shiftStatements } from '../../state/video_debate/effects'
import FieldWithButton from '../FormUtils/FieldWithButton'
import Modal from '../Modal/Modal'
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

class EditVideoModal extends React.PureComponent {
  renderTitle() {
    return (
      <div className="flex gap-2 items-center dark:text-foreground">
        <Edit size="1em" /> {this.props.t('video.edit')}
      </div>
    )
  }

  render() {
    const { t, popModal, video } = this.props
    const unlistedOptions = [
      { value: true, label: t('main:videos.unlisted') },
      { value: false, label: t('main:videos.public') },
    ]

    return (
      <Modal handleCloseClick={popModal} title={this.renderTitle()}>
        <div className="flex flex-col">
          <h3 className="mb-2 text-[15px] font-bold dark:text-foreground">Change visibility</h3>
          <Mutation mutation={editVideoMutation}>
            {(editVideo) => (
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
            )}
          </Mutation>
        </div>
        {video['youtube_id'] && (
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
                  const reply = await this.props.shiftStatements(values)
                  setSubmitting(false)
                  this.props.popModal()
                  return reply
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
      </Modal>
    )
  }
}

const mapDispatchToProps = {
  popModal,
  shiftStatements,
}

export default withTranslation(['videoDebate', 'main'])(
  connect((state) => ({ video: state.VideoDebate.video.data }), mapDispatchToProps)(EditVideoModal),
)
