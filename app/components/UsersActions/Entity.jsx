import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { connect } from 'react-redux'
import TimeDisplay from '../Utils/TimeDisplay'
import { forcePosition } from '../../state/video_debate/video/reducer'
import { ENTITY_SPEAKER, ENTITY_STATEMENT } from '../../constants'
import { SpeakerPreview } from '../Speakers/SpeakerPreview'


/**
 * Display a list of `UserAction` as an history
 */
@connect((state, props) => ({
  reference: state.UsersActions.referenceEntities.get(props.entityKey),
  speakers: state.VideoDebate.video.data.speakers
}), {forcePosition})
@translate(['main', 'videoDebate'])
export default class Entity extends React.PureComponent {
  render() {
    return (
      <div className="entity">
        { this.getEntityPreview() }
      </div>
    )
  }

  getEntityPreview() {
    const { reference, speakers, entity, t } = this.props
    if (entity === ENTITY_STATEMENT) {
      const speakerId = reference.get('speaker_id')
      const speaker = speakers.find(s => s.id === speakerId)
      const text = reference.get('text')
      return (
        <h4 className="title is-4">
          { speaker && <strong>{speaker.full_name} </strong> }
          <TimeDisplay time={ reference.time } capitalize={!speaker}
                       handleClick={p => this.props.forcePosition(p)}/>
          <span> - </span>
          <div className="statement-text">{ text }</div>
        </h4>
      )
    }
    else if (entity === ENTITY_SPEAKER)
      return <SpeakerPreview speaker={reference} withoutActions={true}/>
  }
}

Entity.PropTypes = {
  /**
   Entity type. See `constants.js` entity section
   */
  entity: PropTypes.number.isRequired,
  /**
   * Entity key to get its records in store
   */
  entityKey: PropTypes.string.isRequired
}