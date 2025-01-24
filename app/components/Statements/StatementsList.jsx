import memoizeOne from 'memoize-one'
import React from 'react'
import FlipMove from 'react-flip-move'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { FULLHD_WIDTH_THRESHOLD } from '../../constants'
import { postStatement } from '../../state/video_debate/statements/effects'
import { closeStatementForm, setScrollTo } from '../../state/video_debate/statements/reducer'
import { statementFormValueSelector } from '../../state/video_debate/statements/selectors'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import StatementContainer from './StatementContainer'
import { StatementForm } from './StatementForm'

@connect(
  (state) => ({
    speakers: state.VideoDebate.video.data.speakers,
    statements: state.VideoDebate.statements.data,
    statementFormSpeakerId: statementFormValueSelector(state, 'speaker_id'),
    statementFormText: statementFormValueSelector(state, 'text'),
    statementFormTime: statementFormValueSelector(state, 'time'),
    offset: state.VideoDebate.video.offset,
  }),
  { closeStatementForm, postStatement, setScrollTo },
)
@withTranslation('videoDebate')
@withRouter
@withLoggedInUser
export default class StatementsList extends React.PureComponent {
  componentDidMount() {
    const searchParams = new URLSearchParams(this.props.location.search)
    if (searchParams.has('statement')) {
      this.props.setScrollTo({
        id: parseInt(searchParams.get('statement')),
        __forceAutoScroll: true,
      })
    }
  }

  componentDidUpdate(oldProps) {
    const searchParams = new URLSearchParams(this.props.location.search)
    const oldSearchParams = new URLSearchParams(oldProps.location.search)
    const curStatementQuery = searchParams.get('statement')
    if (curStatementQuery && curStatementQuery !== oldSearchParams.get('statement')) {
      this.props.setScrollTo({
        id: parseInt(curStatementQuery),
        __forceAutoScroll: true,
      })
    }
  }

  getInitialValues = memoizeOne((speakerId, text, time) => ({
    speaker_id: speakerId,
    text,
    time,
  }))

  filterStatements = memoizeOne((statements, isLoggedIn) => {
    if (!isLoggedIn) {
      return statements.filter((s) => !s.is_draft)
    } else {
      return statements
    }
  })

  render() {
    const { speakers, statementFormSpeakerId, offset } = this.props
    const speakerId =
      speakers.size === 1 && !statementFormSpeakerId ? speakers.get(0).id : statementFormSpeakerId
    const statements = this.filterStatements(this.props.statements, this.props.isAuthenticated)
    return (
      <div>
        {statementFormSpeakerId !== undefined && (
          <div className="mb-4 max-w-[980px] mx-auto">
            <StatementForm
              offset={offset}
              initialValues={this.getInitialValues(
                speakerId,
                this.props.statementFormText,
                this.props.statementFormTime,
              )}
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
          </div>
        )}
        <FlipMove
          enterAnimation="fade"
          disableAllAnimations={window.innerWidth < FULLHD_WIDTH_THRESHOLD}
          className="flex flex-col gap-8"
        >
          {statements.map((statement) => (
            <div key={statement.id}>
              <StatementContainer statement={statement} />
            </div>
          ))}
        </FlipMove>
      </div>
    )
  }
}
