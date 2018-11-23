import React from 'react'
import { css } from 'emotion'

const Col = (props) => {
  const { baseWidth, responsiveWidths, children, staticStyles, dynamicStyles } = props
  return <div className={
    `staticStyles ? staticStyles : ''`.concat(' ', css({
      gridColumn: `span ${baseWidth}`,
      ...dynamicStyles,
    }))
  }>
    {children}
  </div>
}

export default Col