import { Flag, Reply } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { cn } from '@/lib/css-utils'

import { MIN_REPUTATION_FLAG } from '../../constants'
import ReputationGuard from '../Utils/ReputationGuard'
import CommentAction from './CommentAction'

const OtherCommentActions = ({ t, isFlagged, handleReply, handleFlag }) => (
  <React.Fragment>
    <CommentAction title={t('actions.reply')} icon={<Reply size="1em" />} onClick={handleReply} />
    <ReputationGuard requiredRep={MIN_REPUTATION_FLAG}>
      <CommentAction
        className={cn('action-report', { selected: isFlagged })}
        title={isFlagged ? t('actions.flagged') : t('misc.flags')}
        icon={<Flag size="1em" />}
        onClick={handleFlag}
        disabled={isFlagged}
      />
    </ReputationGuard>
  </React.Fragment>
)

export default withTranslation('main')(OtherCommentActions)
