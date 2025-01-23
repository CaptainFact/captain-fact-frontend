import React from 'react'
import { withTranslation } from 'react-i18next'

import { Button } from '../ui/button'

const CommentsListExpender = ({ t, onClick, nesting, count }) => (
  <div className="ml-4">
    <Button variant="outline" onClick={onClick}>
      {t('comment.loadMore', {
        context: nesting === 1 ? 'comments' : 'replies',
        count,
      })}
    </Button>
  </div>
)

export default withTranslation('videoDebate')(CommentsListExpender)
