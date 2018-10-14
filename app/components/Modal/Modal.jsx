import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classNames from 'classnames'

import { popModal } from '../../state/modals/reducer'
import { Icon } from '../Utils/Icon'
import Button from '../Utils/Button'


const Modal = ({
  helpLink,
  popModal,
  isActive = true,
  title = null,
  children = null,
  footer = null,
  className = null,
  isAbsolute = false,
  overrideContentStructure = false,
  handleCloseClick = null
}) => (
    <div className={classNames('modal', className, { 'is-active': isActive, 'is-absolute': isAbsolute })}>
      <div className="modal-background" onClick={handleCloseClick || popModal} />
      <div className="modal-card">
        {title
          && (
            <header className="modal-card-head">
              <div className="modal-card-title">
                {title}
              </div>
              {helpLink
                && (
                  <Link to={helpLink} className="help-link" target="_blank">
                    <Icon name="question-circle" size="medium" />
                  </Link>
                )
              }
              <Button className="delete" onClick={handleCloseClick || popModal} />
            </header>
          )
        }
        {overrideContentStructure ? children : (
          <section className="modal-card-body">
            {children}
          </section>
        )}
        {footer
          && (
            <footer className="modal-card-foot">
              {footer}
            </footer>
          )
        }
      </div>
    </div>
  )

export default connect(null, { popModal })(Modal)
