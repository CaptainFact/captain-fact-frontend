import React from 'react'
import { connect } from 'react-redux'
import { Trans, withNamespaces } from 'react-i18next'

import { InfoCircle } from 'styled-icons/fa-solid/InfoCircle'
import { ExclamationCircle } from 'styled-icons/fa-solid/ExclamationCircle'

import { isLoadingVideoDebate } from '../../state/video_debate/selectors'
import VideoDebateHistory from './VideoDebateHistory'
import ActionBubbleMenu from './ActionBubbleMenu'
import StatementsList from '../Statements/StatementsList'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { hasStatementForm } from '../../state/video_debate/statements/selectors'
import { Icon } from '../Utils/Icon'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import Message from '../Utils/Message'

@connect(state => ({
  isLoading: isLoadingVideoDebate(state),
  hasStatements: state.VideoDebate.statements.data.size !== 0,
  hasSpeakers: state.VideoDebate.video.data.speakers.size !== 0,
  hasStatementForm: hasStatementForm(state),
  unlisted: state.VideoDebate.video.data.unlisted
}))
@withNamespaces('videoDebate')
@withLoggedInUser
export class ColumnDebate extends React.PureComponent {
  renderInfo(message) {
    return (
      <Message>
        <InfoCircle size="1em" />
        &nbsp;&nbsp;{message}
      </Message>
    )
  }

  renderWarning(message) {
    return (
      <Message type="warning">
        <ExclamationCircle size="1em" />
        &nbsp;&nbsp;{message}
      </Message>
    )
  }

  renderHelp() {
    const { hasSpeakers, isAuthenticated, t } = this.props
    let helpMessage = ''
    if (!isAuthenticated) {
      helpMessage = t('tips.noContentUnauthenticated')
    } else if (!hasSpeakers) {
      helpMessage = t('tips.firstSpeaker')
    } else {
      helpMessage = (
        <Trans i18nKey="tips.firstStatement" parent="span">
          [Now] <strong>[add]</strong> [click] <Icon name="commenting-o" />
          &nbsp;[icon]
        </Trans>
      )
    }

    return this.renderInfo(helpMessage)
  }

  renderContent() {
    const { isLoading, view, videoId, hasStatements } = this.props

    if (view === 'history') {
      return <VideoDebateHistory videoId={videoId} />
    }
    if (view === 'debate') {
      if (isLoading) {
        return <LoadingFrame title={this.props.t('loading.statements')} />
      }

      const hasStatementsComponents = hasStatements || this.props.hasStatementForm
      return (
        <div className="statements-list-container">
          <div className="video-debate-help">
            {this.props.unlisted && this.renderWarning(this.props.t('warningUnlisted'))}
            {!hasStatementsComponents && this.renderHelp()}
          </div>
          {hasStatementsComponents && <StatementsList />}
          <ActionBubbleMenu />
        </div>
      )
    }
  }

  render() {
    return (
      <div id="col-debate" className="column">
        {this.renderContent()}
      </div>
    )
  }
}
