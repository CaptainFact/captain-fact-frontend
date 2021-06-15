import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { withRouter } from 'react-router'
import FlipMove from 'react-flip-move'
import styled from 'styled-components'

import { StatementForm } from './StatementForm'
import { closeStatementForm, setScrollTo } from '../../state/video_debate/statements/reducer'
import { postStatement } from '../../state/video_debate/statements/effects'
import { statementFormValueSelector } from '../../state/video_debate/statements/selectors'
import StatementContainer from './StatementContainer'
import { FULLHD_WIDTH_THRESHOLD } from '../../constants'

const ResumeAutoScrollButton = styled.button`
  position: sticky;
  z-index: 100;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #828282;
  color: #ffffff;
  border: 0;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 1px 1px 2px #656565;
  transition: background-color 0.1s ease-out;

  &:hover {
    background-color: #646464;
  }

  @media (max-width: 500px) {
    width: 100%;
    left: 0;
    bottom: 5px;
    transform: translateX(0);
  }

  // Hide button on mobile/tablet devices
  @media (max-width: 1279px) {
    display: none;
  }
`
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
  state = { autoscrollEnabled: true, scrollToFocusedStatement: true }

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
    const {
      speakers,
      statementFormSpeakerId,
      statements,
      offset,
      postStatement,
      closeStatementForm,
      t,
    } = this.props
    const { autoscrollEnabled, scrollToFocusedStatement } = this.state

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
            handleAbort={() => closeStatementForm()}
            handleConfirm={(s) =>
              postStatement(s).then((e) => {
                if (!e.error) {
                  closeStatementForm()
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
            <StatementContainer
              key={statement.id}
              statement={statement}
              autoscrollEnabled={autoscrollEnabled}
              scrollToFocusedStatement={scrollToFocusedStatement}
              toggleAutoscroll={() => {
                this.setState({
                  autoscrollEnabled: !autoscrollEnabled,
                  scrollToFocusedStatement: false,
                })
              }}
            />
          ))}
        </FlipMove>
        {!autoscrollEnabled && (
          <ResumeAutoScrollButton
            type="button"
            onClick={() => {
              this.setState({ autoscrollEnabled: true, scrollToFocusedStatement: true })
            }}
          >
            {t('statement.autoscroll_resume')}
          </ResumeAutoScrollButton>
        )}
      </div>
    )
  }
}
