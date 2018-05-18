import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Field, reduxForm, reset } from 'redux-form'
import { AsyncCreatable } from 'react-select'
import debounce from 'debounce-promise'
import latinise from 'voca/latinise'

import { renderFieldWithLabel, validateLength, cleanStr, checkLength } from '../FormUtils'
import { SocketApi } from '../../API'
import { SPEAKER_NAME_LENGTH, SPEAKER_TITLE_LENGTH } from '../../constants'
import { addSpeaker } from '../../state/video_debate/effects'


const validate = ({full_name, title}) => {
  const errors = {}
  validateLength(errors, 'full_name', full_name, SPEAKER_NAME_LENGTH)
  if (title) validateLength(errors, 'title', title, SPEAKER_TITLE_LENGTH)
  return errors
}

const capitalizeName = (str) => (
  str.replace(/(?:(?!-|\s).)+/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
)

const searchSpeakerRequest = debounce((query) => (
  // TODO This request has nothing to do here !
  SocketApi.push('video_debate', 'search_speaker', {query})
    .then(({speakers}) => ({options: speakers}))
), 250)


@translate('videoDebate')
@connect(null, {addSpeaker, reset})
class SpeakerField extends React.PureComponent {
  render() {
    const {input, t, addSpeaker, reset} = this.props
    return (
      <AsyncCreatable
        name={input.name}
        value={input.value}
        placeholder={`${t('speaker.add')}...`}
        onChange={e => {
          if (!e)
            return
          const speaker = {full_name: capitalizeName(cleanStr(e.full_name))}
          if (e.id !== e.full_name)
            speaker.id = e.id
          if (checkLength(e.full_name, SPEAKER_NAME_LENGTH))
            addSpeaker(speaker).then(() => reset('add_speaker'))
        }}
        tabSelectsValue={false}
        cache={false}
        labelKey="full_name"
        valueKey="id"
        promptTextCreator={
          name => (checkLength(name, SPEAKER_NAME_LENGTH) ?
            t('speaker.create', {name: capitalizeName(name)}) : '...')
        }
        searchPromptText={t('speaker.search')}
        loadOptions={(query, callback) => {
          if (!query || query.length < 3)
            callback(null, [])
          else
            searchSpeakerRequest(query).then(speakers => callback(null, speakers))
        }}
        ignoreAccents={false}
        filterOption={({ full_name }, filter) =>
          latinise(full_name).toLowerCase().includes(latinise(filter))
        }
      />
    )
  }
}

@reduxForm({form: 'addSpeaker', validate})
export class AddSpeakerForm extends React.PureComponent {
  render() {
    return (
      <form className="form">
        <Field name="speaker" component={SpeakerField}/>
      </form>
    )
  }
}

@reduxForm({form: 'editSpeaker', validate})
@translate('videoDebate')
export class EditSpeakerForm extends React.PureComponent {
  render() {
    return (
      <div className="form">
        <div className="form-fields">
          <Field
            className="input"
            name="full_name"
            type="text"
            component={renderFieldWithLabel}
            label={this.props.t('speaker.fullName')}
            placeholder="Barack Obama, Dark Vador..."
            normalize={s => capitalizeName(cleanStr(s))}
          />
          <Field
            className="input"
            name="title"
            type="text"
            component={renderFieldWithLabel}
            label={this.props.t('speaker.title')}
            normalize={cleanStr}
            placeholder={this.props.t('speaker.titlePlaceholder')}
          />
          <button type="submit" className="not-displayed"/>
        </div>
      </div>
    )
  }
}
