import React from 'react'
import { translate } from 'react-i18next'

import { connect } from 'react-redux'
import { HistoryEntry } from './HistoryEntry'
import TimeDisplay from '../Utils/TimeDisplay'
import { forcePosition } from '../../state/video_debate/video/reducer'
import { ENTITY_SPEAKER, ENTITY_STATEMENT } from '../../constants'


@connect((state, props) => ({
  reference: state.VideoDebate.history.referenceEntities.get(props.entityKey),
  speakers: state.VideoDebate.video.data.speakers
}), {forcePosition})
@translate(['main', 'videoDebate'])
export class EntityHistory extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { isExpended: props.defaultExpended || false }
  }

  getTitle() {
    const { reference, speakers, entity, t } = this.props
    if (entity === ENTITY_STATEMENT) {
      const speakerId = reference.get('speaker_id')
      const speaker = speakers.find(s => s.id === speakerId)
      const text = reference.get('text')
      return (
        <div>
          { speaker && <strong>{speaker.full_name} </strong> }
          <TimeDisplay time={ reference.time } capitalize={!speaker}
                       handleClick={p => this.props.forcePosition(p)}/>
          <span> - </span>
          <div className="statement-text">{ text }</div>
        </div>
      )
    }
    else if (entity === ENTITY_SPEAKER) return (
      <div>
        <strong>{ reference.get('full_name') }</strong>
        {reference.get('title') !== null && (
         <small>, { reference.get('title') }</small>
        )}
      </div>
    )
  }

  render() {
    const { actions } = this.props
    const { isExpended } = this.state
    if (actions.size === 0)
      return <div/>

    const latestAction = actions.first()
    const oldActions = actions.rest()
    return (
      <div className="entity-actions">
        <h4 className="entity-title title is-4">
          { this.getTitle() }
        </h4>
        <div className="latest-action">
          <HistoryEntry key={ latestAction.id } action={ latestAction } isLatest={ true }/>
        </div>
        { actions.size > 1 &&
          <a className="expend-old-actions"
             onClick={() => this.setState({ isExpended: !isExpended })}>
            { isExpended ? 'Hide' : `Show full history (${actions.size - 1} elements)` }
          </a>
        }
        {isExpended &&
          <div className="old-actions">
            {oldActions.map(action =>
              <div key={ action.id }>
                <div className="separator"/>
                <HistoryEntry action={ action } isLatest={ false }/>
              </div>
            )}
          </div>
        }
      </div>
    )
  }
}