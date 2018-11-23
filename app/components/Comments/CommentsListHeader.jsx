import React from "react"

/**
 * Empty divs are used by CSS to draw lines
 */
const CommentsListHeader = ({ header }) => (
  <div className="comments-list-header">
    <div />
    <span>{header}</span>
    <div />
  </div>
)

export default CommentsListHeader
