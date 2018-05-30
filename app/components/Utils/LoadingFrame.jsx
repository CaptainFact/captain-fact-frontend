import React from 'react'
import { translate } from 'react-i18next'
import classNames from 'classnames'


@translate('main')
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

