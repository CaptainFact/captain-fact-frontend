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


@connect(state => ({
  statements: state.VideoDebate.statements.data,
  statementFormSpeakerId: statementFormValueSelector(state, 'speaker_id')
}), {closeStatementForm, postStatement, setScrollTo})
@withNamespaces('videoDebate')
@withRouter
export default class StatementsList extends React.PureComponent {
  componentDidMount() {
    if (this.props.location.query.statement) {
      this.props.setScrollTo({id: parseInt(this.props.location.query.statement), __forceAutoScroll: true})
    }
  }

  render() {
    const {statementFormSpeakerId, statements} = this.props
    return (
      <div className="statements-list">
        {statementFormSpeakerId !== undefined && (
          <StatementForm
            initialValues={{speaker_id: statementFormSpeakerId}}
            enableReinitialize
            keepDirtyOnReinitialize
            handleAbort={() => this.props.closeStatementForm()}
            handleConfirm={s => this.props.postStatement(s).then(
              e => {if (!e.error) this.props.closeStatementForm(); return e}
            )}
          />
        )}
        <FlipMove enterAnimation="fade">
          {statements.map(statement => (
            <StatementContainer key={statement.id} statement={statement}/>
          ))}
        </FlipMove>
      </div>
    )
  }
}
