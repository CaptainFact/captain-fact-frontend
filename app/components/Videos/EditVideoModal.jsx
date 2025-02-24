import { Mutation } from '@apollo/client/react/components'
import { Formik } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import Select from 'react-select'
import { Edit } from 'styled-icons/fa-regular'

import { toast } from '@/hooks/use-toast'

import { popModal } from '../../state/modals/reducer'
import { shiftStatements } from '../../state/video_debate/effects'
import FieldWithButton from '../FormUtils/FieldWithButton'
import Modal from '../Modal/Modal'
import { StyledH3 } from '../StyledUtils/Title'
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
      <div className="flex gap-2 items-center">
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
          <StyledH3 mb={2} fontSize="15px" fontWeight="700">
            Change visibility
          </StyledH3>
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
                      className="speaker-select"
                      placeholder="Select visibility"
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 99999 }) }}
                      options={unlistedOptions}
                      value={unlistedOptions.find((option) => option.value === values.unlisted)}
                      name="unlisted"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      onChange={({ value }) => {
                        setFieldValue('unlisted', value)
                        handleSubmit()
                      }}
                    />
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
              <StyledH3 mb={2} fontSize="15px" fontWeight="700">
                {t('video.shiftStatements')}
              </StyledH3>
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
