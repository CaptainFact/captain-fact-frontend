import React from "react"
import { withNamespaces } from "react-i18next"

import { connect } from "react-redux"
import TimeDisplay from "../Utils/TimeDisplay"
import { forcePosition } from "../../state/video_debate/video/reducer"
import { ENTITY_SPEAKER, ENTITY_STATEMENT } from "../../constants"
import { SpeakerPreview } from "../Speakers/SpeakerPreview"

/**
 * Display a list of `UserAction` as an history
 */
@connect(
  (state, props) => ({
    reference: state.UsersActions.referenceEntities.get(props.entityKey),
    speakers: state.VideoDebate.video.data.speakers,
  }),
  { forcePosition },
)
@withNamespaces("main")
export default class Entity extends React.PureComponent {
  render() {
    return <div className="entity">{this.getEntityPreview()}</div>
  }

  getEntityPreview() {
    const { reference, speakers, entity } = this.props
    if (entity === ENTITY_STATEMENT) {
      const speakerId = reference.get("speaker_id")
      const speaker = speakers.find((s) => s.id === speakerId)
      const text = reference.get("text")
      return (
        <h4 className="title is-4">
          {speaker && <strong>{speaker.full_name} </strong>}
          <TimeDisplay time={reference.time} capitalize={!speaker} handleClick={(p) => this.props.forcePosition(p)} />
          <hr />
          <div className="statement-text">{text}</div>
        </h4>
      )
    }
    if (entity === ENTITY_SPEAKER) return <SpeakerPreview speaker={reference} withoutActions />
  }
}
