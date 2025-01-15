import PropTypes from 'prop-types'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { cn } from '@/lib/css-utils'

@withTranslation('main')
export class LoadingFrame extends React.PureComponent {
  render() {
    const { title, className } = this.props

    return (
      <div className={cn('flex-col mx-auto text-center justify-center items-center', className)}>
        <div className="spinner w-16 h-16" />
        <div className="text-xl">{title || this.props.t('actions.loading')}...</div>
      </div>
    )
  }
}

LoadingFrame.propTypes = {
  title: PropTypes.string,
}
