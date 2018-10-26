import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { Field, reduxForm, reset } from 'redux-form'
import { AsyncCreatable } from 'react-select'
import debounce from 'debounce-promise'
import latinise from 'voca/latinise'

import { checkLength } from '../../lib/form_validators'
import { SocketApi } from '../../API'
import { SPEAKER_NAME_LENGTH } from '../../constants'
import { addSpeaker } from '../../state/video_debate/effects'
import capitalizeName from '../../lib/name_formatter'
import { cleanStr } from '../../lib/clean_str'


const searchSpeakerRequest = debounce((query) => (
  // TODO This request has nothing to do here !
  SocketApi.push('video_debate', 'search_speaker', { query })
    .then(({ speakers }) => ({ options: speakers }))
), 250)

@reduxForm({ form: 'addSpeaker' })
@connect(null, { addSpeaker, reset })
@withNamespaces('videoDebate')
export default class AddSpeakerForm extends React.PureComponent {
  render() {
    return (
      <form className="form">
        <Field
          name="speaker"
          component={props => this.renderSpeakerField(props)}
          disabled={this.props.disabled}
        />
      </form>
    )
  }

  renderSpeakerField({ input, disabled }) {
    return (
      <AsyncCreatable
        disabled={disabled}
        name={input.name}
        value={input.value}
        onChange={e => this.onChange(e)}
        promptTextCreator={name => this.promptTextCreator(name)}
        loadOptions={this.loadOptions}
        filterOption={this.filterOption}
        placeholder={`${this.props.t('speaker.add')}...`}
        searchPromptText={this.props.t('speaker.search')}
        tabSelectsValue={false}
        cache={false}
        labelKey="full_name"
        valueKey="id"
        ignoreAccents={false}
      />
    )
  }

  filterOption({ full_name }, filter) {
    return latinise(full_name).toLowerCase().includes(latinise(filter))
  }

  loadOptions(query, callback) {
    if (!query || query.length < 3)
      callback(null, [])
    else
      searchSpeakerRequest(query).then(speakers => callback(null, speakers))
  }

  onChange(e) {
    const { addSpeaker, reset } = this.props

    if (!e)
      return
    const speaker = { full_name: capitalizeName(cleanStr(e.full_name)) }
    if (e.id !== e.full_name)
      speaker.id = e.id
    if (checkLength(e.full_name, SPEAKER_NAME_LENGTH))
      addSpeaker(speaker).then(() => reset('add_speaker'))
  }

  promptTextCreator(speakerName) {
    return checkLength(speakerName, SPEAKER_NAME_LENGTH)
      ? this.props.t('speaker.create', { name: capitalizeName(speakerName) })
      : '...'
  }
}
