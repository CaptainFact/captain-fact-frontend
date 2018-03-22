import React from "react"
import { Link, withRouter } from "react-router"

import { LinkWithIcon } from "../Utils"
import { translate } from 'react-i18next'
import Message from './Message'
import { getErrorInfo, tError } from '../../lib/errors'


const refreshableErrors = ['join_crashed']


@withRouter
@translate('errors')
export class ErrorView extends React.PureComponent {
  getMoreInfo() {
    const errorInfo = getErrorInfo(this.props.error)
    if (!errorInfo)
      return null
    return (
      <span>&nbsp;-&nbsp;
        <Link to={errorInfo.url}>
          {this.props.t(errorInfo.i18nKey || 'main:actions.moreInfo')}
        </Link>
      </span>
    )
  }

  render() {
    const { t, error='unknown', canGoBack=true } = this.props
    const canReload = this.props.canReload || refreshableErrors.includes(error)
    return (
      <div className="message-view">
        <Message
          type="danger"
          header={<p><strong>{t('title')}</strong></p>}>
            <div>
              <p>{tError(t, error)}{this.getMoreInfo()}</p>
              {(canGoBack || canReload) && <br/>}
              {canGoBack && <LinkWithIcon iconName="arrow-left"
                                          onClick={() => this.props.router.goBack()}>
                {t('main:actions.goBack')}
              </LinkWithIcon>}
              {canReload && <LinkWithIcon iconName="refresh"
                                          onClick={() => location.reload()}
                                          style={{float: 'right'}}>
                {t('main:actions.reload')}
              </LinkWithIcon>}
            </div>
        </Message>
      </div>
    )
  }
}
