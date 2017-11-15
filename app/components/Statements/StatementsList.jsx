import React from 'react'
import { connect } from "react-redux"
import { translate } from 'react-i18next'
import { withRouter } from 'react-router'

import { StatementForm } from './StatementForm'
import { Statement } from './Statement'
import { closeStatementForm, setScrollTo } from '../../state/video_debate/statements/reducer'
import { postStatement } from '../../state/video_debate/statements/effects'
import { statementFormValueSelector } from '../../state/video_debate/statements/selectors'



@connect(state => ({
  statements: state.VideoDebate.statements.data,
  statementFormSpeakerId: statementFormValueSelector(state, 'speaker_id')
}), {closeStatementForm, postStatement, setScrollTo})
@translate('videoDebate')
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
        {statementFormSpeakerId !== undefined &&
        <StatementForm
          initialValues={{speaker_id: statementFormSpeakerId}}
          enableReinitialize={true}
          keepDirtyOnReinitialize={true}
          handleAbort={() => this.props.closeStatementForm()}
          handleConfirm={s => this.props.postStatement(s).then(
            e => {if (!e.error) this.props.closeStatementForm(); return e;}
          )}/>
        }
        {statements.map(statement => <Statement key={statement.id} statement={statement}/>)}
      </div>
    )
  }
}