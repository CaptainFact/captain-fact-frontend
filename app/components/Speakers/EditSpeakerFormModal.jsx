import { useMutation } from '@apollo/client'
import debounce from 'debounce-promise'
import { Formik } from 'formik'
import { capitalize, pick, truncate } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Trans, withTranslation } from 'react-i18next'
import { Save } from 'styled-icons/boxicons-regular'
import { Ban } from 'styled-icons/fa-solid'
import { LinkExternal } from 'styled-icons/octicons'

import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/css-utils'

import { UPDATE_SPEAKER_MUTATION } from '../../API/graphql_queries'
import { searchOnWikidata } from '../../API/wikidata'
import { SPEAKER_NAME_LENGTH, SPEAKER_TITLE_LENGTH } from '../../constants'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { cleanStr } from '../../lib/clean_str'
import { validateLengthI18n } from '../../lib/form_validators'
import capitalizeName from '../../lib/name_formatter'
import { ReactiveAsyncSelect, ReactSelectTheme } from '../../lib/react_select_theme'
import { wikidataURL } from '../../lib/url_utils'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import ExternalLinkNewTab from '../Utils/ExternalLinkNewTab'

const EditSpeakerFormModal = ({ speaker, open, onOpenChange, t }) => {
  const { locale: userLocale } = useUserPreferences()
  const locale = userLocale

  const [hasWikidataSearchBar, setHasWikidataSearchBar] = useState(!speaker.wikidataItemId)
  const [initialSuggestions, setInitialSuggestions] = useState(null)
  const [updateSpeaker] = useMutation(UPDATE_SPEAKER_MUTATION)

  useEffect(() => {
    const loadInitialSuggestions = async () => {
      const { fullName, wikidataItemId } = speaker

      if (fullName && !wikidataItemId) {
        const searchResults = await searchOnWikidata(fullName, locale)
        if (searchResults.length > 0) {
          setInitialSuggestions(searchResults)
        }
      }
    }

    loadInitialSuggestions()
  }, [speaker, locale])

  const onSubmit = async (values, actions) => {
    try {
      await updateSpeaker({
        variables: {
          id: values.id,
          fullName: values.fullName,
          title: values.title,
          wikidataItemId: values.wikidataItemId,
        },
      })

      onOpenChange(false)
    } catch {
      toast({
        variant: 'destructive',
        title: t('errors:title'),
        description: t('errors:client.submissionError'),
      })
    } finally {
      actions.setSubmitting(false)
    }
  }

  const validate = ({ fullName, title, wikidataItemId }) => {
    const errors = {}
    validateLengthI18n(t, errors, 'fullName', fullName, SPEAKER_NAME_LENGTH)
    if (title) {
      validateLengthI18n(t, errors, 'title', title, SPEAKER_TITLE_LENGTH)
    }
    if (wikidataItemId && wikidataItemId[0] !== 'Q') {
      errors.wikidataItemId = "Must start with 'Q', eg. Q178517"
    }
    return errors
  }

  const loadOptions = debounce(async (search) => {
    const searchResults = await searchOnWikidata(search, locale)
    return searchResults.map((searchEntry) => {
      const description = truncate(capitalize(searchEntry.description), { length: 60 })
      return {
        value: searchEntry,
        label: `${searchEntry.label}${description ? ` - ${description}` : ''}`,
      }
    })
  }, 250)

  const getLabel = (label, maxLength) => {
    const charactersStr = t('main:misc.character', { count: maxLength })
    return `${label} (\u2264 ${maxLength} ${charactersStr})`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{t('speaker.edit', { name: speaker.fullName })}</DialogTitle>
          <DialogDescription>{t('speaker.details')}</DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={pick(speaker, ['id', 'fullName', 'title', 'wikidataItemId'])}
          onSubmit={onSubmit}
          validate={validate}
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
            <>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Wikidata search */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-foreground mb-3">
                      {t('wikidata.autofill')}
                    </h3>
                    <div className="mb-4">
                      {values.wikidataItemId && !hasWikidataSearchBar ? (
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
                          <Trans i18nKey="videoDebate:wikidata.using">
                            Using data from{' '}
                            <a
                              href={wikidataURL(values.wikidataItemId)}
                              className="font-medium dark:text-blue-400 dark:hover:text-blue-300"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {{ qid: values.wikidataItemId }}
                            </a>{' '}
                            (
                            <Button
                              type="button"
                              variant="link"
                              size="xs"
                              onClick={() => setHasWikidataSearchBar(true)}
                            >
                              edit
                            </Button>
                            )
                          </Trans>
                        </div>
                      ) : (
                        <ReactiveAsyncSelect
                          inputId="wikidata-search"
                          placeholder={t('wikidata.search')}
                          tabSelectsValue={false}
                          loadOptions={loadOptions}
                          theme={ReactSelectTheme}
                          noOptionsMessage={({ inputValue }) =>
                            inputValue.length < 3 ? t('speaker.search') : t('speaker.noneFound')
                          }
                          onChange={({ value }) => {
                            setValues({
                              ...values,
                              wikidataItemId: value.id,
                              fullName: value.label,
                              title: capitalize(value.description),
                            })
                            setHasWikidataSearchBar(false)
                          }}
                        />
                      )}
                    </div>

                    {hasWikidataSearchBar && initialSuggestions && (
                      <ScrollArea className="bg-gray-50 dark:bg-gray-900 rounded-lg h-[400px] shadow-inner">
                        <ul className="divide-y divide-gray-200">
                          {initialSuggestions.map(({ id, label, description, url }) => (
                            <li key={id} className="p-3 hover:bg-gray-100">
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
                                      wikidataItemId: id,
                                      fullName: label,
                                      title: capitalize(description),
                                    })
                                    setHasWikidataSearchBar(false)
                                  }}
                                >
                                  {t('speaker.select')}
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    )}
                  </div>

                  {/* Speaker form */}
                  <div className="space-y-4 md:border-l md:border-gray-200 dark:md:border-border md:pl-6">
                    <h3 className="font-medium text-gray-900 dark:text-foreground mb-3">
                      {t('speaker.details')}
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium dark:text-foreground"
                        >
                          {getLabel(t('speaker.fullName'), SPEAKER_NAME_LENGTH[1])}
                        </label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="Barack Obama, Dark Vador..."
                          value={values.fullName}
                          onChange={(e) =>
                            setFieldValue('fullName', capitalizeName(cleanStr(e.target.value)))
                          }
                        />
                        {errors.fullName && (
                          <p className="text-red-500 dark:text-red-400 text-sm">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium dark:text-foreground"
                        >
                          {getLabel(t('speaker.title'), SPEAKER_TITLE_LENGTH[1])}
                        </label>
                        <Input
                          id="title"
                          name="title"
                          placeholder={t('speaker.titlePlaceholder')}
                          value={values.title || ''}
                          onChange={(e) => setFieldValue('title', cleanStr(e.target.value))}
                          autoComplete="off"
                        />
                        {errors.title && (
                          <p className="text-red-500 dark:text-red-400 text-sm">{errors.title}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="wikidataItemId"
                          className="block text-sm font-medium dark:text-foreground"
                        >
                          {t('wikidata.id')}
                        </label>
                        <Input
                          id="wikidataItemId"
                          name="wikidataItemId"
                          placeholder="QXXXXXXXX"
                          value={values.wikidataItemId || ''}
                          onChange={(e) =>
                            e.target.value.length > 1
                              ? setFieldValue('wikidataItemId', cleanStr(e.target.value))
                              : setFieldValue('wikidataItemId', null)
                          }
                          autoComplete="off"
                        />
                        {errors.wikidataItemId && (
                          <p className="text-red-500 dark:text-red-400 text-sm">
                            {errors.wikidataItemId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              <DialogFooter>
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
                  onClick={() => onOpenChange(false)}
                >
                  <Ban className="w-4 h-4" />
                  <span className="ml-2">{t('main:actions.cancel')}</span>
                </Button>
              </DialogFooter>
            </>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default withTranslation('videoDebate')(EditSpeakerFormModal)
