import React from 'react'
import { ds } from './../../../styles/tokens'
import { pxTo } from "design-system-utils"
import { css } from 'emotion'

const Grid = (props) => {
  const { col, gutterWidth, colBaseWidth, dynamicStyles, staticStyles, children } = props
  const baseFontSize = ds.get("type.sizes.baseFontSize")

  return <div className={
    `${staticStyles}`.concat(' ',
      css({
        display: "grid",
        gridTemplateColumns: `repeat(${col ? col : ds.get("grid.columns.number")}, ${colBaseWidth ? colBaseWidth : "1fr"})`,
        gridTemplateRows: "auto 1fr auto",
        gridColumnGap: gutterWidth ? gutterWidth : pxTo(ds.get("grid.gutterWidth"), baseFontSize, "rem"),
        ...dynamicStyles
      })
    )
    }
  >
    { children}
  </div>
}

export default Grid

