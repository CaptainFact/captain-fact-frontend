import React from "react"
import { Link } from 'react-router'
import classNames from 'classnames'

import { Icon } from '../Utils/Icon'


const Modal = ({
  isActive=true, helpLink, title=null, children=null, footer=null, className=null,
  isAbsolute=false, overrideContentStructure=false, handleCloseClick=null
}) => (
  <div className={classNames('modal', className, {'is-active': isActive, 'is-absolute': isAbsolute})}>
    <div className="modal-background" onClick={handleCloseClick}/>
    <div className="modal-card">
      {title &&
        <header className="modal-card-head">
          <div className="modal-card-title">
            {title}
          </div>
          {helpLink &&
          <Link to={helpLink} className="help-link" target="_BLANK">
            <Icon name="question-circle"/>
          </Link>
          }
          {handleCloseClick && <button className="delete" onClick={() => handleCloseClick()}/>}
        </header>
      }
      { overrideContentStructure ? children : (
        <section className="modal-card-body">
          {children}
        </section>
      )}
      { footer &&
      <footer className="modal-card-foot">
        {footer}
      </footer>
      }
    </div>
  </div>
)

export default Modal

