import { Delete, Plus } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'

import CommentAction from './CommentAction'

const OwnCommentActions = ({ t, handleAddToThread, handleDelete }) => (
  <React.Fragment>
    <CommentAction
      title={t('actions.addToThread')}
      icon={<Plus size="1em" />}
      onClick={handleAddToThread}
    />
    <CommentAction
      title={t('actions.delete')}
      icon={<Delete size="1em" />}
      onClick={handleDelete}
    />
  </React.Fragment>
)

export default withTranslation('main')(OwnCommentActions)
