import { Mutation } from '@apollo/client/react/components'
import classNames from 'classnames'
import gql from 'graphql-tag'
import React from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { MIN_REPUTATION_START_AUTOMATIC_STATEMENTS_EXTRACTION } from '../../constants'
import { flashError, flashSuccessMsg } from '../../state/flashes/reducer'
import { destroyStatementForm } from '../../state/video_debate/statements/effects'
import { changeStatementForm } from '../../state/video_debate/statements/reducer'
import { hasStatementForm } from '../../state/video_debate/statements/selectors'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { Icon } from '../Utils/Icon'

const startAutomaticStatementsExtractionMutation = gql`
  mutation StartAutomaticStatementsExtraction($videoId: Int!) {
    startAutomaticStatementsExtraction(videoId: $videoId) {
      id
    }
  }
`

@connect(
  (state) => ({
    hasAutoscroll: state.UserPreferences.enableAutoscroll,
    soundOnBackgroundFocus: state.UserPreferences.enableSoundOnBackgroundFocus,
    hasStatementForm: hasStatementForm(state),
    hasStatements: state.VideoDebate.statements.data.size > 0,
    videoId: state.VideoDebate.video.data.id,
  }),
  {
    changeStatementForm,
    destroyStatementForm,
    flashError,
    flashSuccessMsg,
  },
)
@withNamespaces('videoDebate')
@withRouter
@withLoggedInUser
export default class ActionBubbleMenu extends React.PureComponent {
  state = {
    hasCalledStatementsExtract: false,
  }

  render() {
    const {
      t,
      hasStatementForm,
      isAuthenticated,
      hidden,
      customActions,
      loggedInUser,
      hasStatements,
      videoId,
    } = this.props
    return (
      <div
        className={classNames('action-bubble-container', {
          hasForm: hasStatementForm,
          hiddenBelow: hidden,
        })}
      >
        {isAuthenticated ? (
          <React.Fragment>
            <ActionBubble
              iconName={hasStatementForm ? 'times' : 'commenting-o'}
              label={t(hasStatementForm ? 'statement.abortAdd' : 'statement.add')}
              activated={!hasStatementForm}
              onClick={() => !hidden && this.onStatementBubbleClick()}
            />
            {!hasStatements &&
              loggedInUser.reputation >= MIN_REPUTATION_START_AUTOMATIC_STATEMENTS_EXTRACTION && (
                <Mutation mutation={startAutomaticStatementsExtractionMutation}>
                  {(startAutomaticStatementsExtraction, { loading }) => (
                    <ActionBubble
                      disabled={loading || this.state.hasCalledStatementsExtract}
                      loading={loading}
                      iconName="tasks"
                      label={t('statement.startAutomaticExtraction')}
                      onClick={async () => {
                        try {
                          this.setState({ hasCalledStatementsExtract: true })
                          await startAutomaticStatementsExtraction({ variables: { videoId } })
                          this.props.flashSuccessMsg(
                            'videoDebate:statement.automaticExtractionSuccess',
                          )
                        } catch (e) {
                          this.setState({ hasCalledStatementsExtract: true })
                          this.props.flashError({ message: t('errors:server.unknown') })
                        }
                      }}
                    />
                  )}
                </Mutation>
              )}
            {customActions || null}
          </React.Fragment>
        ) : (
          <ActionBubble
            iconName="sign-in"
            label={t('main:menu.signup')}
            onClick={() => this.props.history.push('/signup')}
          />
        )}
      </div>
    )
  }

  onStatementBubbleClick() {
    if (this.props.hasStatementForm) {
      this.props.destroyStatementForm()
    } else {
      const subPathRegex = new RegExp('/videos/(.+)/(captions|transcript)/?')
      const match = subPathRegex.exec(location.pathname)
      if (match) {
        this.props.history.push(`/videos/${match[1]}`)
      }

      const values = this.props.getStatementInitialValues?.() || {}
      this.props.changeStatementForm({ speaker_id: 0, ...values })
    }
  }
}

export const ActionBubble = ({ iconName, label, activated = true, loading = false, ...props }) => (
  <div className={classNames('action-bubble', { activated })} {...props}>
    <div className="label">{label}</div>
    {loading ? (
      <div className="spinner-container">
        <span className="round-spinner" />
      </div>
    ) : (
      <Icon name={iconName} />
    )}
  </div>
)
