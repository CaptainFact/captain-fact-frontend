import React from 'react'
import classNames from 'classnames'

import translate from 'react-i18next/dist/commonjs/translate';
import Button from './Button'


const PAGINATION_ELLIPSIS = (
  <li><span className="pagination-ellipsis">&hellip;</span></li>
)

const makeLink = (page, disabled, onPageChange = null, isCurrent = false) => (
  <li>
    <Button
      className={classNames('pagination-link', {'is-current': isCurrent})}
      disabled={disabled}
      aria-label={`Go to page ${page}`}
      onClick={onPageChange && (() => onPageChange(page))}
    >
      {page}
    </Button>
  </li>
)

const pageSelectButtonsList = (nbStart, nbEnd, disabled, onPageChange) => {
  if (nbStart > nbEnd) {
    return null
  }

  if (nbStart === nbEnd) {
    return makeLink(nbStart, disabled, onPageChange)
  }
  return (
    <React.Fragment>
      {makeLink(nbStart, disabled, onPageChange)}
      {nbStart + 1 <= nbEnd && PAGINATION_ELLIPSIS}
      {makeLink(nbEnd, disabled, onPageChange)}
    </React.Fragment>
  )
}

const PaginationMenu = ({disabled, currentPage, total, onPageChange, t}) => (
  <nav className="pagination is-centered" role="navigation" aria-label="pagination">
    <Button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={disabled || currentPage === 1}
      className="pagination-previous"
    >
      {t('pagination.prev')}
    </Button>
    <Button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={disabled || currentPage === total}
      className="pagination-next"
    >
      {t('pagination.next')}
    </Button>
    <ul className="pagination-list">
      {pageSelectButtonsList(1, currentPage - 1, disabled, onPageChange)}
      {makeLink(currentPage, disabled, null, true)}
      {pageSelectButtonsList(currentPage + 1, total, disabled, onPageChange)}
    </ul>
  </nav>
)

export default translate('main')(PaginationMenu)
