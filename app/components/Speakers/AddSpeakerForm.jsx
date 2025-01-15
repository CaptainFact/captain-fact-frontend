import debounce from 'debounce-promise'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import AsyncCreatable from 'react-select/async-creatable'

import { SocketApi } from '../../API'
import { SPEAKER_NAME_LENGTH } from '../../constants'
import { cleanStr } from '../../lib/clean_str'
import { checkLength } from '../../lib/form_validators'
import capitalizeName from '../../lib/name_formatter'
import { ReactSelectStyles, ReactSelectTheme } from '../../lib/react_select_theme'
import { addSpeaker } from '../../state/video_debate/effects'
import Container from '../StyledUtils/Container'

@connect(null, { addSpeaker })
@withTranslation('videoDebate')
export default class AddSpeakerForm extends React.PureComponent {
  searchSpeakerRequest = debounce((query) => {
    return query.length < 3
      ? []
      : SocketApi.push('video_debate', 'search_speaker', { query }).then(({ speakers }) => {
          return speakers.map((s) => ({ label: s.full_name, value: s }))
        })
  }, 250)

  promptTextCreator = (speakerName) => {
    return checkLength(speakerName, SPEAKER_NAME_LENGTH)
      ? this.props.t('speaker.create', { name: capitalizeName(speakerName) })
      : '...'
  }

  onChange = ({ value }, { action }) => {
    const { addSpeaker } = this.props

    if (action === 'select-option' && value && value.id) {
      addSpeaker(value)
    } else if (action === 'create-option' && checkLength(value, SPEAKER_NAME_LENGTH)) {
      addSpeaker({ full_name: capitalizeName(cleanStr(value)) })
    }
  }

  render() {
    const { disabled, t } = this.props
    return (
      <AsyncCreatable
        allowCreateWhileLoading={false}
        isDisabled={disabled}
        isValidNewOption={(value) => value.length >= 3}
        formatCreateLabel={this.promptTextCreator}
        tabSelectsValue={false}
        placeholder={`${t('speaker.add')}...`}
        loadOptions={this.searchSpeakerRequest}
        onChange={this.onChange}
        value=""
        noOptionsMessage={() => t('speaker.search')}
        components={{
          LoadingMessage: () => (
            <Container display="flex" p={3} color="black.400" justifyContent="center">
              {t('main:actions.loading')}...
            </Container>
          ),
        }}
        styles={ReactSelectStyles}
        theme={ReactSelectTheme}
      />
    )
  }
}
