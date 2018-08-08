import React from 'react'
import classNames from 'classnames'

import Button from './Button'


const PaginationLink = ({label, isCurrent = false, ...props}) => (
  <li>
    <Button
      className={classNames('pagination-link', {'is-current': isCurrent})}
      aria-label={`Go to page ${label}`}
      {...props}
    >
      {label}
    </Button>
  </li>
)

const PaginationEllipsis = () => (
  <li><span className="pagination-ellipsis">&hellip;</span></li>
)

const PaginationMenu = ({disabled}) => (
  <nav className="pagination is-centered" role="navigation" aria-label="pagination">
    <Button disabled={disabled} className="pagination-previous">
      Previous
    </Button>
    <Button disabled={disabled} className="pagination-next">
      Next page
    </Button>
    <ul className="pagination-list">
      <PaginationLink disabled={disabled} label="1"/>
      <PaginationEllipsis/>
      <PaginationLink disabled={disabled} label="45"/>
      <PaginationLink disabled={disabled} label="46" isCurrent/>
      <PaginationLink disabled={disabled} label="47"/>
      <PaginationEllipsis/>
      <PaginationLink disabled={disabled} label="86"/>
    </ul>
  </nav>
)

export default PaginationMenu
