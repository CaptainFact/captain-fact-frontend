import React from 'react'
import classNames from 'classnames'

const CardLayout = ({
  headerTitle = null,
  headerIcon = null,
  image = null,
  content = null,
  footer = null,
  className = null,
  ContainerType = 'div',
  containerProps = {}
}) => (
  <ContainerType className={classNames('card', className)} {...containerProps}>
    {(headerTitle || headerIcon) && (
      <header className="card-header">
        {headerTitle && <p className="card-header-title">{headerTitle}</p>}
        {headerIcon && <p className="card-header-icon">{headerTitle}</p>}
      </header>
    )}
    {image && <div className="card-image">{image}</div>}
    {content && <div className="card-content">{content}</div>}
    {footer && <footer className="card-footer">{footer}</footer>}
  </ContainerType>
)

export default CardLayout
