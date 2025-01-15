import React from 'react'
import { withTranslation } from 'react-i18next'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const makeLink = (page, disabled, getPageLink, isCurrent = false) => (
  <PaginationItem key={page}>
    <PaginationLink disabled={disabled} to={getPageLink(page)} isActive={isCurrent}>
      {page}
    </PaginationLink>
  </PaginationItem>
)

const pageSelectButtonsList = (nbStart, nbCur, nbEnd, disabled, getPageLink, nbShowAround = 1) => {
  const result = []
  let curPage = nbStart
  while (curPage <= nbEnd) {
    let component = null

    if (curPage < nbCur) {
      if (curPage === nbStart || curPage >= nbCur - nbShowAround - 1) {
        component = makeLink(curPage, disabled, getPageLink, false)
        curPage += 1
      } else {
        component = <PaginationEllipsis key="ellipsis-left" />
        curPage = nbCur - nbShowAround
      }
    } else if (curPage === nbCur) {
      component = makeLink(curPage, disabled, getPageLink, true)
      curPage += 1
    } else if (curPage > nbCur) {
      if (curPage >= nbEnd - 1 || curPage <= nbCur + nbShowAround) {
        component = makeLink(curPage, disabled, getPageLink, false)
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

const PaginationMenu = ({ className, currentPage = 1, total = 1, getPageLink, disabled, t }) => (
  <Pagination className={className}>
    <PaginationContent>
      {currentPage > 1 && (
        <PaginationItem>
          <PaginationPrevious
            to={getPageLink(currentPage - 1)}
            disabled={disabled || currentPage === 1}
          >
            {t('pagination.prev')}
          </PaginationPrevious>
        </PaginationItem>
      )}

      {pageSelectButtonsList(1, currentPage, total, disabled, getPageLink)}

      {currentPage < total && (
        <PaginationItem>
          <PaginationNext
            disabled={disabled || currentPage === total}
            to={getPageLink(currentPage + 1)}
          >
            {t('pagination.next')}
          </PaginationNext>
        </PaginationItem>
      )}
    </PaginationContent>
  </Pagination>
)

export default withTranslation('main')(PaginationMenu)
