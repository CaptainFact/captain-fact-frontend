import React from "react"
import { connect } from "react-redux"
import { translate } from 'react-i18next'
import classNames from "classnames"
import capitalize from 'voca/capitalize'

import { Icon, LoadingFrame } from "../Utils"
import { EntityHistory } from './EntityHistory'
import {
  joinVideoDebateHistoryChannel,
  leaveVideoDebateHistoryChannel
} from '../../state/video_debate/history/effects'
import {ENTITY_SPEAKER, ENTITY_STATEMENT} from '../../constants'


@connect(state => ({
  isLoading: state.VideoDebate.history.isLoading,
  error: state.VideoDebate.history.error,
  allActions: state.VideoDebate.history.entitiesActions
}), {joinVideoDebateHistoryChannel, leaveVideoDebateHistoryChannel})
@translate(['main', 'videoDebate'])
export default class VideoDebateHistory extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { selectedEntity: ENTITY_STATEMENT }
  }

  componentDidMount() {
    this.props.joinVideoDebateHistoryChannel(this.props.videoId)
  }

  componentWillUnmount() {
    this.props.leaveVideoDebateHistoryChannel()
  }

  render() {
    const { isLoading, error, allActions, t } = this.props
    const { selectedEntity } = this.state
    const actions = allActions.filter((_, entityKey) => parseInt(entityKey.split(':')[0]) === selectedEntity)

    return (
      <div className="videodebate-actions-history">
        <section className="header">
          <h2 className="title is-2">
            <Icon size="large" name="history"/>
            <span> { t('videoDebate:history') }</span>
          </h2>
        </section>
        <div className="tabs is-centered is-medium">
          <ul>
            <li className={classNames({'is-active': selectedEntity === ENTITY_STATEMENT})}
                onClick={() => this.setState({selectedEntity: ENTITY_STATEMENT})}>
              <a>{capitalize(t('entities.statement_plural'))}</a>
            </li>
            <li className={classNames({'is-active': selectedEntity === ENTITY_SPEAKER})}
                onClick={() => this.setState({selectedEntity: ENTITY_SPEAKER})}>
              <a>{capitalize(t('entities.speaker_plural'))}</a>
            </li>
          </ul>
        </div>
        <section className="content">
          { isLoading && <LoadingFrame/> }
          { error && error }
          <div className="actions-list">
            { actions.entrySeq().map(([entityKey, actions]) =>
              <EntityHistory key={ entityKey }
                             entityKey={ entityKey }
                             entity={ selectedEntity }
                             actions={ actions }
              />
            )}
          </div>
        </section>
      </div>
    )
  }
}
