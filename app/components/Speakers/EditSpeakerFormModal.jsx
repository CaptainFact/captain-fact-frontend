import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { Box } from '@rebass/grid'
import classNames from 'classnames'
import { pick } from 'lodash'

import { Save } from 'styled-icons/boxicons-regular/Save'
import { Ban } from 'styled-icons/fa-solid/Ban'

import { updateSpeaker } from '../../state/video_debate/effects'
import { popModal } from '../../state/modals/reducer'
import { errorToFlash } from '../../state/flashes/reducer'
import { validateLengthI18n } from '../../lib/form_validators'
import { SPEAKER_NAME_LENGTH, SPEAKER_TITLE_LENGTH } from '../../constants'
import capitalizeName from '../../lib/name_formatter'
import { cleanStr } from '../../lib/clean_str'
import { Formik } from 'formik'
import StyledInput from '../StyledUtils/StyledInput'
import Modal from '../Modal/Modal'
import { Span } from '../StyledUtils/Text'
import Button from '../Utils/Button'

class EditSpeakerFormModal extends React.PureComponent {
  static propTypes = {
    speaker: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  }

  onSubmit = (values, actions) => {
    return this.props
      .updateSpeaker(values)
      .then(e => {
        if (e.errors) {
          actions.setErrors(e.errors)
        } else {
          actions.setSubmitting(false)
          this.props.popModal()
        }
      })
      .catch(e => {
        logError(e)
        this.props.errorToFlash(e)
      })
  }

  validate = ({ full_name, title }) => {
    const { t } = this.props
    const errors = {}
    validateLengthI18n(t, errors, 'full_name', full_name, SPEAKER_NAME_LENGTH)
    if (title) {
      validateLengthI18n(t, errors, 'title', title, SPEAKER_TITLE_LENGTH)
    }
    return errors
  }

  getLabel(label, maxLength) {
    const charactersStr = this.props.t('main:misc.character', { count: maxLength })
    return `${label} (\u2264 ${maxLength} ${charactersStr})`
  }

  render() {
    const { t } = this.props
    const initialValues = pick(this.props.speaker, ['id', 'full_name', 'title'])
    return (
      <Formik initialValues={initialValues} onSubmit={this.onSubmit}>
        {({
          handleSubmit,
          setFieldValue,
          values,
          isSubmitting,
          isValid,
          submitForm,
          errors
        }) => (
          <Modal
            title={t('speaker.edit', { name: this.props.speaker.full_name })}
            className="modal-form"
            footer={
              <div className="form-buttons">
                <Button
                  onClick={submitForm}
                  disabled={isSubmitting || !isValid}
                  className={classNames('is-primary', { 'is-loading': isSubmitting })}
                >
                  <Save size="1.25em" />
                  <Span ml={1}>{t('main:actions.save')}</Span>
                </Button>
                <Button
                  type="reset"
                  disabled={isSubmitting}
                  onClick={() => this.props.popModal()}
                >
                  <Ban size="1em" />
                  <Span ml={1}>{t('main:actions.cancel')}</Span>
                </Button>
              </div>
            }
          >
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-fields">
                <Box mb={3}>
                  <label className="label">
                    {this.getLabel(t('speaker.fullName'), SPEAKER_NAME_LENGTH[1])}
                  </label>
                  <StyledInput
                    name="full_name"
                    placeholder="Barack Obama, Dark Vador..."
                    value={values.full_name}
                    onChange={e =>
                      setFieldValue('full_name', capitalizeName(cleanStr(e.target.value)))
                    }
                  />
                </Box>

                <label className="label">
                  {this.getLabel(t('speaker.title'), SPEAKER_TITLE_LENGTH[1])}
                </label>
                <StyledInput
                  name="title"
                  placeholder={this.props.t('speaker.titlePlaceholder')}
                  value={values.title}
                  onChange={e => setFieldValue('title', cleanStr(e.target.value))}
                  autoComplete="off"
                />
              </div>
            </form>
          </Modal>
        )}
      </Formik>
    )
  }
}

export default withNamespaces('videoDebate')(
  connect(
    null,
    { updateSpeaker, popModal, errorToFlash }
  )(EditSpeakerFormModal)
)
