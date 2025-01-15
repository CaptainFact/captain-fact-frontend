import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link, withRouter } from 'react-router-dom'

import { getErrorInfo, tError } from '../../lib/errors'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'

const refreshableErrors = ['join_crashed']

@withRouter
@withTranslation('errors')
export class ErrorView extends React.PureComponent {
  render() {
    const { t, error = 'unknown', canGoBack = true } = this.props
    const canReload = this.props.canReload || refreshableErrors.includes(error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('title')}</AlertTitle>
        <AlertDescription>
          <p>{tError(t, error)}</p>
          <p>{this.getMoreInfo()}</p>
          {(canGoBack || canReload) && <br />}
          <div className="flex items-center gap-2 flex-wrap">
            {canGoBack && (
              <Button size="xs" variant="outline" onClick={() => this.props.history.goBack()}>
                <ArrowLeft size="1em" />
                {t('main:actions.goBack')}
              </Button>
            )}
            {canReload && (
              <Button size="xs" variant="outline" onClick={() => location.reload()}>
                <RefreshCw size="1em" />
                {t('main:actions.reload')}
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
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
