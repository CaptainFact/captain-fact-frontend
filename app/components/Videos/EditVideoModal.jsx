import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { Formik } from 'formik'
import { Flex } from '@rebass/grid'

import { Edit } from 'styled-icons/fa-regular'

import { shiftStatements } from '../../state/video_debate/effects'
import Modal from '../Modal/Modal'
import { popModal } from '../../state/modals/reducer'
import { flashErrorMsg, flashSuccessMsg } from '../../state/flashes/reducer'
import FieldWithButton from '../FormUtils/FieldWithButton'
import StyledLabel from '../FormUtils/StyledLabel'
import { StyledH3 } from '../StyledUtils/Title'

class EditVideoModal extends React.PureComponent {
  renderTitle() {
    return (
      <span>
        <Edit size="1em" /> {this.props.t('video.edit')}
      </span>
    )
  }

  render() {
    const { t, popModal, video } = this.props

    return (
      <Modal handleCloseClick={popModal} title={this.renderTitle()}>
        <Flex flexDirection="column">
          <StyledH3>{t('video.shiftStatements')}</StyledH3>
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
                <Flex>
                  <StyledLabel fontSize={3} mr={3}>
                    Youtube
                  </StyledLabel>
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
                    buttonLabel={t('main:actions.apply')}
                    buttonClickHandler={handleSubmit}
                  />
                </Flex>
              </form>
            )}
          </Formik>
        </Flex>
      </Modal>
    )
  }
}

const mapDispatchToProps = {
  popModal,
  flashErrorMsg,
  flashSuccessMsg,
  shiftStatements,
}

export default withNamespaces(['videoDebate', 'main'])(
  connect((state) => ({ video: state.VideoDebate.video.data }), mapDispatchToProps)(EditVideoModal)
)
