import classNames from 'classnames'
import React from 'react'
import { withNamespaces } from 'react-i18next'

import Button from './Button'

const PaginationEllipsis = () => (
  <li>
    <span className="pagination-ellipsis">&hellip;</span>
  </li>
)

const makeLink = (LinkBuilder, page, disabled, onPageChange = null, isCurrent = false) => (
  <li key={page}>
    <LinkBuilder
      className={classNames('pagination-link', { 'is-current': isCurrent })}
      disabled={disabled}
      aria-label={`Go to page ${page}`}
      onClick={onPageChange ? () => onPageChange(page) : undefined}
      data-page={page}
    >
      {page}
    </LinkBuilder>
  </li>
)

const pageSelectButtonsList = (
  LinkBuilder,
  nbStart,
  nbCur,
  nbEnd,
  disabled,
  onPageChange,
  nbShowArround = 2
) => {
  const result = []
  let curPage = nbStart
  while (curPage <= nbEnd) {
    let component = null

    // Left pagination part
    if (curPage < nbCur) {
      if (curPage === nbStart || curPage >= nbCur - nbShowArround - 1) {
        component = makeLink(LinkBuilder, curPage, disabled, onPageChange)
        curPage += 1
      } else {
        component = <PaginationEllipsis key="ellipsis-left" />
        curPage = nbCur - nbShowArround
      }
    }
    // Always show a selected link for current page
    else if (curPage === nbCur) {
      component = makeLink(LinkBuilder, curPage, disabled, null, true)
      curPage += 1
    }
    // Right pagination part
    else if (curPage > nbCur) {
      if (curPage >= nbEnd - 1 || curPage <= nbCur + nbShowArround) {
        component = makeLink(LinkBuilder, curPage, disabled, onPageChange)
        curPage += 1
      } else {
        component = <PaginationEllipsis key="ellipsis-right" />
        curPage = nbEnd
      }
    }
    result.push(component)
  }
  return result
}

const PaginationMenu = ({
  className,
  disabled,
  currentPage = 1,
  total = 1,
  isRounded,
  onPageChange,
  LinkBuilder = (props) => <Button {...props} />,
  t,
}) => {
  const allClasses = classNames('pagination is-centered', className, {
    'is-rounded': isRounded,
  })

  return (
    <nav className={allClasses} role="navigation" aria-label="pagination">
      <LinkBuilder
        onClick={onPageChange ? () => onPageChange(currentPage - 1) : undefined}
        disabled={disabled || currentPage === 1}
        className="pagination-previous"
        data-page={currentPage - 1}
      >
        {t('pagination.prev')}
      </LinkBuilder>
      <LinkBuilder
        onClick={onPageChange ? () => onPageChange(currentPage + 1) : undefined}
        disabled={disabled || currentPage === total}
        className="pagination-next"
        data-page={currentPage + 1}
      >
        {t('pagination.next')}
      </LinkBuilder>
      <ul className="pagination-list">
        {pageSelectButtonsList(LinkBuilder, 1, currentPage, total, disabled, onPageChange)}
      </ul>
    </nav>
  )
}

export default withNamespaces('main')(PaginationMenu)
