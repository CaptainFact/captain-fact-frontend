import React from 'react'
import { withNamespaces } from 'react-i18next'

import CommentAction from './CommentAction'

const OwnCommentActions = ({ t, handleAddToThread, handleDelete }) => (
  <React.Fragment>
    <CommentAction
      title={t('actions.addToThread')}
      iconName="plus"
      onClick={handleAddToThread}
    />
    <CommentAction
      title={t('actions.delete')}
      iconName="times"
      onClick={handleDelete}
    />
  </React.Fragment>
)

export default withNamespaces('main')(OwnCommentActions)
