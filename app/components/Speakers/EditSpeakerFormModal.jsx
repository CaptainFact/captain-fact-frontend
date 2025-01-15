import debounce from 'debounce-promise'
import { Formik } from 'formik'
import { capitalize, pick, truncate } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { Trans, withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import AsyncSelect from 'react-select/async'
import { Save } from 'styled-icons/boxicons-regular'
import { Ban } from 'styled-icons/fa-solid'
import { LinkExternal } from 'styled-icons/octicons'

import { cn } from '@/lib/css-utils'
import { toastError } from '@/lib/toasts'

import { searchOnWikidata } from '../../API/wikidata'
import { SPEAKER_NAME_LENGTH, SPEAKER_TITLE_LENGTH } from '../../constants'
import { cleanStr } from '../../lib/clean_str'
import { validateLengthI18n } from '../../lib/form_validators'
import capitalizeName from '../../lib/name_formatter'
import { ReactSelectStyles, ReactSelectTheme } from '../../lib/react_select_theme'
import { wikidataURL } from '../../lib/url_utils'
import { popModal } from '../../state/modals/reducer'
import { updateSpeaker } from '../../state/video_debate/effects'
import Modal from '../Modal/Modal'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

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
        toastError(e.payload)
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
          dirty,
          submitForm,
          errors,
        }) => (
          <Modal
            title={t('speaker.edit', { name: this.props.speaker.full_name })}
            className="p-4 max-w-5xl"
            footer={
              <div className="flex justify-end gap-2">
                <Button
                  onClick={submitForm}
                  disabled={isSubmitting || !isValid || !dirty}
                  className={cn('', { 'opacity-50 cursor-not-allowed': isSubmitting })}
                >
                  <Save className="w-5 h-5" />
                  <span className="ml-2">{t('main:actions.save')}</span>
                </Button>
                <Button
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => this.props.popModal()}
                >
                  <Ban className="w-4 h-4" />
                  <span className="ml-2">{t('main:actions.cancel')}</span>
                </Button>
              </div>
            }
          >
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Wikidata search */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 mb-3">{t('wikidata.autofill')}</h3>
                  <div className="mb-4">
                    {values.wikidata_item_id && !hasWikidataSearchBar ? (
                      <div className="bg-blue-50 p-3 rounded-md">
                        <Trans i18nKey="videoDebate:wikidata.using">
                          Using data from{' '}
                          <a
                            href={wikidataURL(values.wikidata_item_id)}
                            className="font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {{ qid: values.wikidata_item_id }}
                          </a>{' '}
                          (
                          <Button
                            type="button"
                            variant="link"
                            size="xs"
                            onClick={() => this.setState({ hasWikidataSearchBar: true })}
                          >
                            edit
                          </Button>
                          )
                        </Trans>
                      </div>
                    ) : (
                      <AsyncSelect
                        inputId="wikidata-search"
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
                  </div>

                  {hasWikidataSearchBar && initialSuggestions && (
                    <ScrollArea className="bg-gray-50 rounded-lg h-[400px] shadow-inner">
                      <div className="p-4">
                        <ul className="divide-y divide-gray-200">
                          {initialSuggestions.map(({ id, label, description, url }) => (
                            <li key={id} className="py-3 hover:bg-gray-100">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold">
                                      {truncate(label, { length: 60 })}
                                    </p>
                                    <ExternalLinkNewTab
                                      href={url}
                                      className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm transition-colors"
                                    >
                                      <LinkExternal className="w-3 h-3 mr-1" />
                                      Wikidata
                                    </ExternalLinkNewTab>
                                  </div>
                                  {description && (
                                    <p className="text-sm text-gray-600">{description}</p>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="xs"
                                  onClick={() => {
                                    setValues({
                                      ...values,
                                      wikidata_item_id: id,
                                      full_name: label,
                                      title: capitalize(description),
                                    })
                                    this.setState({ hasWikidataSearchBar: false })
                                  }}
                                >
                                  {t('speaker.select')}
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </ScrollArea>
                  )}
                </div>

                {/* Speaker form */}
                <div className="space-y-4 md:border-l md:border-gray-200 md:pl-6">
                  <h3 className="font-medium text-gray-900 mb-3">{t('speaker.details')}</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="full_name" className="block text-sm font-medium">
                        {this.getLabel(t('speaker.fullName'), SPEAKER_NAME_LENGTH[1])}
                      </label>
                      <Input
                        id="full_name"
                        name="full_name"
                        placeholder="Barack Obama, Dark Vador..."
                        value={values.full_name}
                        onChange={(e) =>
                          setFieldValue('full_name', capitalizeName(cleanStr(e.target.value)))
                        }
                      />
                      {errors.full_name && (
                        <p className="text-red-500 text-sm">{errors.full_name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="title" className="block text-sm font-medium">
                        {this.getLabel(t('speaker.title'), SPEAKER_TITLE_LENGTH[1])}
                      </label>
                      <Input
                        id="title"
                        name="title"
                        placeholder={t('speaker.titlePlaceholder')}
                        value={values.title || ''}
                        onChange={(e) => setFieldValue('title', cleanStr(e.target.value))}
                        autoComplete="off"
                      />
                      {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="wikidata_item_id" className="block text-sm font-medium">
                        {t('wikidata.id')}
                      </label>
                      <Input
                        id="wikidata_item_id"
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
                        <p className="text-red-500 text-sm">{errors.wikidata_item_id}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Modal>
        )}
      </Formik>
    )
  }
}

export default withTranslation('videoDebate')(
  connect(
    (state) => ({
      locale: state.VideoDebate.video.data.language || state.UserPreferences.locale,
    }),
    { updateSpeaker, popModal },
  )(EditSpeakerFormModal),
)
