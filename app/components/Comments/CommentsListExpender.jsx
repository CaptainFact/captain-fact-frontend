import React from 'react'
import { withNamespaces } from 'react-i18next'

import Button from '../Utils/Button'

const CommentsListExpender = ({ t, onClick, nesting, count }) => (
  <div className="comments-expender">
    <Button onClick={onClick}>
      {t('comment.loadMore', {
        context: nesting === 1 ? 'comments' : 'replies',
        count
      })}
    </Button>
  </div>
)

export default withNamespaces('videoDebate')(CommentsListExpender)
