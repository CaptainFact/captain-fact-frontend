import React from 'react'
import { useTranslation } from 'react-i18next'
import { Warning } from 'styled-icons/material'

import FlagReasonSelect from '../Moderation/FlagReasonSelect'
import { Separator } from '../ui/separator'
import Message from '../Utils/Message'
import CommentDisplayV2 from './CommentDisplayV2'

const FlagForm = ({ comment }) => {
  const { t } = useTranslation('videoDebate')

  return (
    <div>
      <div className="mb-4">
        <Message type="warning">
          <div className="flex items-center">
            <div className="mr-2">
              <Warning size={40} className="text-[#ffdd57]" />
            </div>
            <div>
              <p>{t('flagForm.warningMessage1')}</p>
              <p>{t('flagForm.warningMessage2')}</p>
              <p>{t('flagForm.warningMessage3')}</p>
            </div>
          </div>
        </Message>
      </div>
      <CommentDisplayV2 comment={comment} withoutActions hideThread />
      <Separator className="my-4" />
      <FlagReasonSelect />
    </div>
  )
}

export default FlagForm
