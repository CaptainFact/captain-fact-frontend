import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces, Trans } from 'react-i18next'
import { Box } from '@rebass/grid'
import classNames from 'classnames'
import { pick, truncate, capitalize } from 'lodash'
import AsyncSelect from 'react-select/lib/Async'
import debounce from 'debounce-promise'
import { Formik } from 'formik'

import { Save } from 'styled-icons/boxicons-regular'
import { Ban } from 'styled-icons/fa-solid'
import { LinkExternal } from 'styled-icons/octicons'

import { updateSpeaker } from '../../state/video_debate/effects'
import { popModal } from '../../state/modals/reducer'
import { errorToFlash } from '../../state/flashes/reducer'
import { validateLengthI18n } from '../../lib/form_validators'
import { SPEAKER_NAME_LENGTH, SPEAKER_TITLE_LENGTH } from '../../constants'
import capitalizeName from '../../lib/name_formatter'
import { cleanStr } from '../../lib/clean_str'
import StyledInput from '../StyledUtils/StyledInput'
import Modal from '../Modal/Modal'
import { Span } from '../StyledUtils/Text'
import Button from '../Utils/Button'
import { ReactSelectStyles, ReactSelectTheme } from '../../lib/react_select_theme'
import StyledLink from '../StyledUtils/StyledLink'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'
import { wikidataURL } from '../../lib/url_utils'
import { searchOnWikidata } from '../../API/wikidata'
import { P } from '../StyledUtils/Text'

class EditSpeakerFormModal extends React.PureComponent {
  static propTypes = {
    speaker: PropTypes.object.isRequired,
    language: PropTypes.string,
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      hasWikidataSearchBar: !props.speaker.wikidata_item_id,
      initialSuggestions: null,
    }
  }

  async componentDidMount() {
    const { full_name, wikidata_item_id } = this.props.speaker

    if (full_name && !wikidata_item_id) {
      const searchResults = await searchOnWikidata(full_name, this.props.locale)
      if (searchResults.length > 0) {
        this.setState({ initialSuggestions: searchResults })
      }
    }
  }

  onSubmit = (values, actions) => {
    return this.props.updateSpeaker(values).then((e) => {
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

  loadOptions = debounce(async (search) => {
    const searchResults = await searchOnWikidata(search, this.props.locale)
    return searchResults.map((searchEntry) => {
      const description = truncate(capitalize(searchEntry.description), { length: 60 })
      return {
        value: searchEntry,
        label: `${searchEntry.label}${description ? ` - ${description}` : ''}`,
      }
    })
  }, 250)

  getLabel(label, maxLength) {
    const charactersStr = this.props.t('main:misc.character', { count: maxLength })
    return `${label} (\u2264 ${maxLength} ${charactersStr})`
  }

  render() {
    const { t } = this.props
    const { initialSuggestions, hasWikidataSearchBar } = this.state

    return (
      <Formik
        initialValues={pick(this.props.speaker, ['id', 'full_name', 'title', 'wikidata_item_id'])}
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
          errors,
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
                <Button type="reset" disabled={isSubmitting} onClick={() => this.props.popModal()}>
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
                  {values.wikidata_item_id && !hasWikidataSearchBar ? (
                    <Box>
                      <Trans i18nKey="wikidata.using">
                        Using data from{' '}
                        <ExternalLinkNewTab href={wikidataURL(values.wikidata_item_id)}>
                          {{ qid: values.wikidata_item_id }}
                        </ExternalLinkNewTab>{' '}
                        (
                        <StyledLink onClick={() => this.setState({ hasWikidataSearchBar: true })}>
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
                      noOptionsMessage={({ inputValue }) =>
                        inputValue.length < 3 ? t('speaker.search') : t('speaker.noneFound')
                      }
                      onChange={({ value }) => {
                        setValues({
                          ...values,
                          wikidata_item_id: value.id,
                          full_name: value.label,
                          title: capitalize(value.description),
                        })
                        this.setState({
                          hasWikidataSearchBar: false,
                        })
                      }}
                    />
                  )}
                </Box>
                {hasWikidataSearchBar && initialSuggestions && (
                  <div className="content">
                    <P fontWeight="bold" mt={3}>
                      {t('wikidata.suggestions')}
                    </P>
                    <ul>
                      {initialSuggestions.map(({ id, label, description, url }) => (
                        <li key={id}>
                          <StyledLink
                            onClick={() => {
                              setValues({
                                ...values,
                                wikidata_item_id: id,
                                full_name: label,
                                title: capitalize(description),
                              })
                              this.setState({
                                hasWikidataSearchBar: false,
                              })
                            }}
                          >
                            {truncate(label, { length: 60 })}
                          </StyledLink>
                          {description ? ` - ${description}` : ''} (
                          <ExternalLinkNewTab href={url}>
                            <Span mr={1}>Wikidata</Span>
                            <LinkExternal size="1em" />
                          </ExternalLinkNewTab>
                          )
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <hr />
                <Box mb={3}>
                  <label className="label">
                    {this.getLabel(t('speaker.fullName'), SPEAKER_NAME_LENGTH[1])}
                  </label>
                  <StyledInput
                    name="full_name"
                    placeholder="Barack Obama, Dark Vador..."
                    value={values.full_name}
                    onChange={(e) => {
                      return setFieldValue('full_name', capitalizeName(cleanStr(e.target.value)))
                    }}
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
                    value={values.title || ''}
                    onChange={(e) => setFieldValue('title', cleanStr(e.target.value))}
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
                    onChange={(e) =>
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
    (state) => ({
      locale: state.VideoDebate.video.data.language || state.UserPreferences.locale,
    }),
    { updateSpeaker, popModal, errorToFlash }
  )(EditSpeakerFormModal)
)
