import React from 'react'
import { withNamespaces } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'

import { getErrorInfo, tError } from '../../lib/errors'
import { LinkWithIcon } from '.'
import Message from './Message'

const refreshableErrors = ['join_crashed']

@withRouter
@withNamespaces('errors')
export class ErrorView extends React.PureComponent {
  render() {
    const { t, error = 'unknown', canGoBack = true } = this.props
    const canReload = this.props.canReload || refreshableErrors.includes(error)
    return (
      <div className="message-view">
        <Message
          type="danger"
          header={
            <p>
              <strong>{t('title')}</strong>
            </p>
          }
        >
          <div>
            <p>
              {tError(t, error)}
              {this.getMoreInfo()}
            </p>
            {(canGoBack || canReload) && <br />}
            {canGoBack && (
              <LinkWithIcon iconName="arrow-left" onClick={() => this.props.history.goBack()}>
                {t('main:actions.goBack')}
              </LinkWithIcon>
            )}
            {canReload && (
              <LinkWithIcon
                iconName="refresh"
                onClick={() => location.reload()}
                style={{ float: 'right' }}
              >
                {t('main:actions.reload')}
              </LinkWithIcon>
            )}
          </div>
        </Message>
      </div>
    )
  }

  getMoreInfo() {
    const errorInfo = getErrorInfo(this.props.error)
    if (!errorInfo) {
      return null
    }
    return (
      <span>
        &nbsp;-&nbsp;
        <Link to={errorInfo.url}>{this.props.t(errorInfo.i18nKey || 'main:actions.moreInfo')}</Link>
      </span>
    )
  }
}
