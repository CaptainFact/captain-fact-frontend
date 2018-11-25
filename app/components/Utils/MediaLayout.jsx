import React from 'react'
import classNames from 'classnames'

const MediaLayout = ({
  left = null,
  content = null,
  right = null,
  className = null,
  ContainerType = 'div',
  containerProps = {}
}) => (
  <ContainerType className={classNames('media', className)} {...containerProps}>
    {left && <div className="media-left">{left}</div>}
    {content && <div className="media-content">{content}</div>}
    {right && <div className="media-right">{right}</div>}
  </ContainerType>
)

export default MediaLayout
