import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { withNamespaces } from 'react-i18next'

@withNamespaces('main')
export class LoadingFrame extends React.PureComponent {
  render() {
    const { title, size = 'large' } = this.props

    return (
      <div className={classNames('loading-frame', `is-${size}`)}>
        <div className="spinner" />
        <div className="title">{title || this.props.t('actions.loading')}...</div>
      </div>
    )
  }
}

LoadingFrame.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  title: PropTypes.string,
}
