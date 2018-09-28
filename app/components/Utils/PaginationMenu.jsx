import React from 'react'
import classNames from 'classnames'

import translate from 'react-i18next/dist/commonjs/translate'
import Button from './Button'


const PAGINATION_ELLIPSIS = (
  <li><span className="pagination-ellipsis">&hellip;</span></li>
)

const makeLink = (LinkBuilder, page, disabled, onPageChange = null, isCurrent = false) => (
  <li>
    <LinkBuilder
      className={classNames('pagination-link', { 'is-current': isCurrent })}
      disabled={disabled}
      aria-label={`Go to page ${page}`}
      onClick={onPageChange ? (() => onPageChange(page)) : undefined}
      data-page={page}
    >
      {page}
    </LinkBuilder>
  </li>
)

const pageSelectButtonsList = (LinkBuilder, nbStart, nbEnd, disabled, onPageChange) => {
  if (nbStart > nbEnd) {
    return null
  }

  if (nbStart === nbEnd) {
    return makeLink(LinkBuilder, nbStart, disabled, onPageChange)
  }
  return (
    <React.Fragment>
      {makeLink(LinkBuilder, nbStart, disabled, onPageChange)}
      {nbStart + 1 <= nbEnd && PAGINATION_ELLIPSIS}
      {makeLink(LinkBuilder, nbEnd, disabled, onPageChange)}
    </React.Fragment>
  )
}

const PaginationMenu = ({
  disabled,
  currentPage = 1,
  total = 1,
  isRounded,
  onPageChange,
  LinkBuilder = (props) => <Button {...props} />,
  t
}) => {
  const className = classNames('pagination is-centered', { 'is-rounded': isRounded })

  return (
    <nav className={className} role="navigation" aria-label="pagination">
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
        {pageSelectButtonsList(LinkBuilder, 1, currentPage - 1, disabled, onPageChange)}
        {makeLink(LinkBuilder, currentPage, disabled, null, true)}
        {pageSelectButtonsList(LinkBuilder, currentPage + 1, total, disabled, onPageChange)}
      </ul>
    </nav>
  )
}

export default translate('main')(PaginationMenu)
