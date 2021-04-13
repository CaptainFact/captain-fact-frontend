import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { withRouter } from 'react-router'
import FlipMove from 'react-flip-move'

import { StatementForm } from './StatementForm'
import { closeStatementForm, setScrollTo } from '../../state/video_debate/statements/reducer'
import { postStatement } from '../../state/video_debate/statements/effects'
import { statementFormValueSelector } from '../../state/video_debate/statements/selectors'
import StatementContainer from './StatementContainer'
import { FULLHD_WIDTH_THRESHOLD } from '../../constants'

@connect(
  (state) => ({
    speakers: state.VideoDebate.video.data.speakers,
    statements: state.VideoDebate.statements.data,
    statementFormSpeakerId: statementFormValueSelector(state, 'speaker_id'),
    offset: state.VideoDebate.video.offset,
  }),
  { closeStatementForm, postStatement, setScrollTo }
)
@withNamespaces('videoDebate')
@withRouter
export default class StatementsList extends React.PureComponent {
  componentDidMount() {
    if (this.props.location.query.statement) {
      this.props.setScrollTo({
        id: parseInt(this.props.location.query.statement),
        __forceAutoScroll: true,
      })
    }
  }

  componentDidUpdate(oldProps) {
    const curStatementQuery = this.props.location.query.statement
    if (curStatementQuery && curStatementQuery !== oldProps.location.query.statement) {
      this.props.setScrollTo({
        id: parseInt(curStatementQuery),
        __forceAutoScroll: true,
      })
    }
  }

  render() {
    const { speakers, statementFormSpeakerId, statements, offset } = this.props
    const speakerId =
      speakers.size === 1 && !statementFormSpeakerId ? speakers.get(0).id : statementFormSpeakerId
    return (
      <div className="statements-list">
        {statementFormSpeakerId !== undefined && (
          <StatementForm
            offset={offset}
            initialValues={{ speaker_id: speakerId }}
            enableReinitialize
            keepDirtyOnReinitialize
            handleAbort={() => this.props.closeStatementForm()}
            handleConfirm={(s) =>
              this.props.postStatement(s).then((e) => {
                if (!e.error) {
                  this.props.closeStatementForm()
                }
                return e
              })
            }
          />
        )}
        <FlipMove
          enterAnimation="fade"
          disableAllAnimations={window.innerWidth < FULLHD_WIDTH_THRESHOLD}
        >
          {statements.map((statement) => (
            <StatementContainer key={statement.id} statement={statement} />
          ))}
        </FlipMove>
      </div>
    )
  }
}
