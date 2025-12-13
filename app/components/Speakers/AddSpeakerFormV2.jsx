import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useMemo, useState } from 'react'
import { withTranslation } from 'react-i18next'

import {
  ADD_SPEAKER_TO_VIDEO_MUTATION,
  CREATE_SPEAKER_MUTATION,
  SEARCH_SPEAKERS_QUERY,
} from '../../API/graphql_queries'
import { SPEAKER_NAME_LENGTH } from '../../constants'
import { cleanStr } from '../../lib/clean_str'
import { checkLength } from '../../lib/form_validators'
import capitalizeName from '../../lib/name_formatter'
import { ReactiveAsyncCreatable, ReactSelectTheme } from '../../lib/react_select_theme'

const AddSpeakerFormV2 = ({ disabled, videoId, t }) => {
  const [isSearching, setIsSearching] = useState(false)

  const [searchSpeakers, { loading: searchLoading }] = useLazyQuery(SEARCH_SPEAKERS_QUERY)
  const [addSpeakerToVideo] = useMutation(ADD_SPEAKER_TO_VIDEO_MUTATION)
  const [createSpeaker] = useMutation(CREATE_SPEAKER_MUTATION)

  const debouncedSearch = useMemo(() => {
    let timeoutId
    return (query) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (query.length >= 3) {
          searchSpeakers({ variables: { query, limit: 5 } })
        }
      }, 250)
    }
  }, [searchSpeakers])

  const handleInputChange = (inputValue) => {
    if (inputValue.length >= 3) {
      setIsSearching(true)
      debouncedSearch(inputValue)
    } else {
      setIsSearching(false)
    }
  }

  const promptTextCreator = (speakerName) => {
    return checkLength(speakerName, SPEAKER_NAME_LENGTH)
      ? t('speaker.create', { name: capitalizeName(speakerName) })
      : '...'
  }

  const onChange = async ({ value }, { action }) => {
    if (action === 'select-option' && value && value.id) {
      // Add existing speaker to video
      await addSpeakerToVideo({
        variables: { videoId, speakerId: value.id },
      })
    } else if (action === 'create-option' && checkLength(value, SPEAKER_NAME_LENGTH)) {
      // Create new speaker and add to video
      await createSpeaker({
        variables: {
          videoId,
          fullName: capitalizeName(cleanStr(value)),
        },
      })
    }
  }

  const loadOptions = async (inputValue) => {
    if (inputValue.length < 3) {
      return []
    }

    const result = await searchSpeakers({ variables: { query: inputValue, limit: 5 } })
    return (
      result.data?.searchSpeakers?.map((speaker) => ({
        label: speaker.fullName,
        value: speaker,
      })) || []
    )
  }

  return (
    <ReactiveAsyncCreatable
      allowCreateWhileLoading={false}
      isDisabled={disabled}
      isValidNewOption={(value) => value.length >= 3}
      formatCreateLabel={promptTextCreator}
      tabSelectsValue={false}
      placeholder={`${t('speaker.add')}...`}
      loadOptions={loadOptions}
      onChange={onChange}
      onInputChange={handleInputChange}
      value=""
      noOptionsMessage={() => t('speaker.search')}
      isLoading={searchLoading && isSearching}
      components={{
        LoadingMessage: () => (
          <div className="flex p-3 text-[#4a4a4a] dark:text-foreground justify-center">
            {t('main:actions.loading')}...
          </div>
        ),
      }}
      theme={ReactSelectTheme}
    />
  )
}

export default withTranslation('videoDebate')(AddSpeakerFormV2)
