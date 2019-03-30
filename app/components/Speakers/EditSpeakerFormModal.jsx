import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces, Trans } from 'react-i18next'
import { Box } from '@rebass/grid'
import classNames from 'classnames'
import { pick, truncate, capitalize } from 'lodash'
import AsyncSelect from 'react-select/lib/Async'
import wikidata from 'wikidata-sdk'
import debounce from 'debounce-promise'

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
import { logWarn } from '../../logger'
import { ReactSelectStyles, ReactSelectTheme } from '../../lib/react_select_theme'
import StyledLink from '../StyledUtils/StyledLink'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { wikidataURL } from '../../lib/url_utils'

class EditSpeakerFormModal extends React.PureComponent {
  static propTypes = {
    speaker: PropTypes.object.isRequired,
    language: PropTypes.string,
    t: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { hasWikidataSearchBar: !props.speaker.wikidata_item_id }
  }

  onSubmit = (values, actions) => {
    return this.props.updateSpeaker(values).then(e => {
      actions.setSubmitting(false)
      if (e.errors) {
        actions.setErrors(e.payload)
      } else if (e.error) {
        this.props.errorToFlash(e.payload)
      } else {
        this.props.popModal()
      }
    })
  }

  validate = ({ full_name, title, wikidata_item_id }) => {
    const { t } = this.props
    const errors = {}
    validateLengthI18n(t, errors, 'full_name', full_name, SPEAKER_NAME_LENGTH)
    if (title) {
      validateLengthI18n(t, errors, 'title', title, SPEAKER_TITLE_LENGTH)
    }
    if (wikidata_item_id && wikidata_item_id[0] !== 'Q') {
      errors.wikidata_item_id = "Must start with 'Q', eg. Q178517"
    }
    return errors
  }

  loadOptions = debounce(async search => {
    if (!search || search.length < 3) {
      return []
    }

    try {
      const language = this.props.locale || 'en'
      const url = wikidata.searchEntities({ search, language, format: 'json', limit: 10 })
      const response = await fetch(url)
      const body = await response.json()
      return body.search.map(searchEntry => {
        const description = truncate(capitalize(searchEntry.description), { length: 60 })
        return {
          value: searchEntry,
          label: `${searchEntry.label}${description ? ` - ${description}` : ''}`
        }
      })
    } catch (e) {
      logWarn(`Wikidata query failed: ${e}`)
      return []
    }
  }, 250)

  getLabel(label, maxLength) {
    const charactersStr = this.props.t('main:misc.character', { count: maxLength })
    return `${label} (\u2264 ${maxLength} ${charactersStr})`
  }

  render() {
    const { t } = this.props
    return (
      <Formik
        initialValues={pick(this.props.speaker, [
          'id',
          'full_name',
          'title',
          'wikidata_item_id'
        ])}
        onSubmit={this.onSubmit}
        validate={this.validate}
      >
        {({
          handleSubmit,
          setFieldValue,
          setValues,
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
                <Box mb={2}>
                  <label className="label">{t('wikidata.autofill')}</label>
                  {values.wikidata_item_id && !this.state.hasWikidataSearchBar ? (
                    <Box>
                      <Trans i18nKey="wikidata.using">
                        Using data from{' '}
                        <ExternalLinkNewTab href={wikidataURL(values.wikidata_item_id)}>
                          {{ qid: values.wikidata_item_id }}
                        </ExternalLinkNewTab>{' '}
                        (
                        <StyledLink
                          onClick={() => this.setState({ hasWikidataSearchBar: true })}
                        >
                          edit
                        </StyledLink>
                        )
                      </Trans>
                    </Box>
                  ) : (
                    <AsyncSelect
                      placeholder={this.props.t('wikidata.search')}
                      tabSelectsValue={false}
                      loadOptions={this.loadOptions}
                      styles={ReactSelectStyles}
                      theme={ReactSelectTheme}
                      noOptionsMessage={() => t('speaker.search')}
                      onChange={({ value }) => {
                        setValues({
                          ...values,
                          wikidata_item_id: value.id,
                          full_name: value.label,
                          title: capitalize(value.description)
                        })
                        this.setState({ hasWikidataSearchBar: false })
                      }}
                    />
                  )}
                </Box>
                <hr />
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
                  {errors.full_name && (
                    <Span color="red" fontSize={6}>
                      {errors.full_name}
                    </Span>
                  )}
                </Box>

                <Box mb={3}>
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
                  {errors.title && (
                    <Span color="red" fontSize={6}>
                      {errors.title}
                    </Span>
                  )}
                </Box>

                <Box mb={3}>
                  <label className="label">{t('wikidata.id')}</label>
                  <StyledInput
                    name="wikidata_item_id"
                    placeholder="QXXXXXXXX"
                    value={values.wikidata_item_id || ''}
                    onChange={e =>
                      e.target.value.length > 1
                        ? setFieldValue('wikidata_item_id', cleanStr(e.target.value))
                        : setFieldValue('wikidata_item_id', null)
                    }
                    autoComplete="off"
                  />
                  {errors.wikidata_item_id && (
                    <Span color="red" fontSize={6}>
                      {errors.wikidata_item_id}
                    </Span>
                  )}
                </Box>
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
    state => ({
      locale: state.VideoDebate.video.data.language || state.UserPreferences.locale
    }),
    { updateSpeaker, popModal, errorToFlash }
  )(EditSpeakerFormModal)
)
