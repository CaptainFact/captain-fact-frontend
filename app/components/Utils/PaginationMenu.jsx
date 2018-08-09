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

const pageSelectButtonsList = (nbStart, nbEnd, disabled) => {
  if (nbStart > nbEnd) {
    return null
  } if (nbStart === nbEnd) {
    return <PaginationLink label={nbStart} disabled={disabled}/>
  }
  return (
    <React.Fragment>
      <PaginationLink label={nbStart} disabled={disabled}/>
      {nbStart + 1 <= nbEnd && <PaginationEllipsis/>}
      <PaginationLink label={nbEnd} disabled={disabled}/>
    </React.Fragment>
  )
}

const PaginationMenu = ({disabled, currentPage, total}) => (
  <nav className="pagination is-centered" role="navigation" aria-label="pagination">
    <Button disabled={disabled || currentPage === 1} className="pagination-previous">
      Previous
    </Button>
    <Button disabled={disabled || currentPage === total} className="pagination-next">
      Next page
    </Button>
    <ul className="pagination-list">
      {pageSelectButtonsList(1, currentPage - 1, disabled)}
      <PaginationLink disabled={disabled} label={currentPage} isCurrent/>
      {pageSelectButtonsList(currentPage + 1, total, disabled)}
    </ul>
  </nav>
)

export default PaginationMenu
