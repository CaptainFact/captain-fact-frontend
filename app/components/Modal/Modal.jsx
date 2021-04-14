import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import classNames from 'classnames'

import { popModal } from '../../state/modals/reducer'
import { Icon } from '../Utils/Icon'
import CloseButton from '../Utils/CloseButton'

const Modal = ({
  helpLink,
  popModal,
  isActive = true,
  title = null,
  customHeader = null,
  children = null,
  footer = null,
  className = null,
  isAbsolute = false,
  overrideContentStructure = false,
  handleCloseClick = null,
  isModalSource = false,
}) => {
  useEffect(() => {
    const backListener = browserHistory.listen((location) => {
      if ('POP' === location.action) {
        popModal()
      }
    })
    return () => {
      backListener()
    }
  })

  return (
    <div
      className={classNames('modal', className, {
        'is-active': isActive,
        'is-absolute': isAbsolute,
        'modal-source': isModalSource,
      })}
    >
      <div className="modal-background" onClick={handleCloseClick || popModal} />
      <div className={classNames('modal-card', { 'modal-card-source': isModalSource })}>
        {title && (
          <header className="modal-card-head">
            <div className="modal-card-title">{title}</div>
            {helpLink && (
              <Link to={helpLink} className="help-link" target="_blank">
                <Icon name="question-circle" size="medium" />
              </Link>
            )}
            <CloseButton size="1.5em" title="Close" onClick={handleCloseClick || popModal} />
          </header>
        )}
        {customHeader}
        {overrideContentStructure ? (
          children
        ) : (
          <section className="modal-card-body">{children}</section>
        )}
        {footer && <footer className="modal-card-foot">{footer}</footer>}
      </div>
    </div>
  )
}

export default connect(null, { popModal })(Modal)
