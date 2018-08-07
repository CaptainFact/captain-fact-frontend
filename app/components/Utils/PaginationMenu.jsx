import React from 'react'
import classNames from 'classnames'

import Button from './Button'


const PaginationLink = ({label, isCurrent = false}) => (
  <li>
    <Button
      className={classNames('pagination-link', {'is-current': isCurrent})}
      aria-label={`Go to page ${label}`}
    >
      {label}
    </Button>
  </li>
)

const PaginationEllipsis = () => (
  <li><span className="pagination-ellipsis">&hellip;</span></li>
)

const PaginationMenu = () => (
  <nav className="pagination is-centered" role="navigation" aria-label="pagination">
    <Button className="pagination-previous">Previous</Button>
    <Button className="pagination-next">Next page</Button>
    <ul className="pagination-list">
      <PaginationLink label="1"/>
      <PaginationEllipsis/>
      <PaginationLink label="45"/>
      <PaginationLink label="46" isCurrent/>
      <PaginationLink label="47"/>
      <PaginationEllipsis/>
      <PaginationLink label="86"/>
    </ul>
  </nav>
)

export default PaginationMenu
