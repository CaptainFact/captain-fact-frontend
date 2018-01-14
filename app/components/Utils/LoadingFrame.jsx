import React from "react"
import { translate } from 'react-i18next'
import capitalize from 'voca/capitalize'
import classNames from 'classnames'


@translate('main')
export class LoadingFrame extends React.PureComponent {
  defaultTitle() {
    // If translation is not available, we'll show "Loading..."
    return capitalize(this.props.t('actions.loading').replace('actions.', ''))
  }

  render() {
    const {title, size="large"} = this.props

    return (
      <div className={classNames('loading-frame', `is-${size}`)}>
        <div className="spinner"/>
        <h2 className="title">{title || this.defaultTitle()}...</h2>
      </div>
    )
  }
}

