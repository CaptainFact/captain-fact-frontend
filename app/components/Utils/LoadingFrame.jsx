import React from 'react'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'


@withNamespaces('main')
export class LoadingFrame extends React.PureComponent {
  render() {
    const {title, size = 'large'} = this.props

    return (
      <div className={classNames('loading-frame', `is-${size}`)}>
        <div className="spinner"/>
        <div className="title">
          {title || this.props.t('actions.loading')}...
        </div>
      </div>
    )
  }
}

