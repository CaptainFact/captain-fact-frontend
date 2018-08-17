import React from 'react'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import CommentAction from './CommentAction'
import ReputationGuard from '../Utils/ReputationGuard'
import { MIN_REPUTATION_FLAG } from '../../constants'


const OtherCommentActions = ({t, isFlagged, handleReply, handleFlag}) => (
  <React.Fragment>
    <CommentAction
      title={t('actions.reply')}
      iconName="reply"
      onClick={handleReply}
    />
    <ReputationGuard requiredRep={MIN_REPUTATION_FLAG}>
      <CommentAction
        className={classNames('action-report', {selected: isFlagged})}
        title={isFlagged ? t('actions.flagged') : t('misc.flags')}
        iconName="flag"
        onClick={handleFlag}
      />
    </ReputationGuard>
  </React.Fragment>
)

export default translate('main')(OtherCommentActions)
