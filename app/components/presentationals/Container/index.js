import React from 'react'
import { ds } from './../../../styles/tokens'
import { pxTo } from "design-system-utils"
import { css } from 'emotion'
import { mq } from './../../../styles/tokens/helpers'

const Container = ({ contained, children, dynamicStyles, staticStyles, ...props }) => {
  const baseFontSize = ds.get("type.sizes.baseFontSize")

  return <div className={
    `mx-auto w-100 ${staticStyles ? staticStyles: ''}
    `.concat(' ', css({
      ...dynamicStyles,
      [mq.sm]: {
        width: contained === true ? pxTo(ds.get("grid.width.sm"), baseFontSize, "rem") : '100%',
      },
      [mq.md]: {
        width: contained === true ? pxTo(ds.get("grid.width.md"), baseFontSize, "rem") : '100%',
      },
      [mq.lg]: {
        width: contained === true ? pxTo(ds.get("grid.width.lg"), baseFontSize, "rem") : '100%',
      },
    }))

  }>
    { children}
  </div>
  }

export default Container