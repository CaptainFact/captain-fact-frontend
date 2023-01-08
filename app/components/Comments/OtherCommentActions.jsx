import classNames from 'classnames'
import React from 'react'
import { withNamespaces } from 'react-i18next'

import { MIN_REPUTATION_FLAG } from '../../constants'
import ReputationGuard from '../Utils/ReputationGuard'
import CommentAction from './CommentAction'

const OtherCommentActions = ({ t, isFlagged, handleReply, handleFlag }) => (
  <React.Fragment>
    <CommentAction title={t('actions.reply')} iconName="reply" onClick={handleReply} />
    <ReputationGuard requiredRep={MIN_REPUTATION_FLAG}>
      <CommentAction
        className={classNames('action-report', { selected: isFlagged })}
        title={isFlagged ? t('actions.flagged') : t('misc.flags')}
        iconName="flag"
        onClick={handleFlag}
        disabled={isFlagged}
      />
    </ReputationGuard>
  </React.Fragment>
)

export default withNamespaces('main')(OtherCommentActions)
