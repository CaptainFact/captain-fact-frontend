import {
  MIN_REPUTATION_ADD_STATEMENT,
  MIN_REPUTATION_REMOVE_SPEAKER,
  MIN_REPUTATION_UPDATE_SPEAKER,
} from 'app/constants'
import { Edit, MessageCircle, MoreHorizontal, X } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Button } from '../ui/button'
import { ReputationGuardTooltip } from '../Utils/ReputationGuardTooltip'

export const SpeakerDropdownMenu = ({ handleRemove, handleEdit, handleAddStatement }) => {
  const { t } = useTranslation('videoDebate')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="icon-xs" className="sm:h-7 sm:w-7 h-6 w-6">
          <MoreHorizontal size="1em" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ReputationGuardTooltip requiredRep={MIN_REPUTATION_UPDATE_SPEAKER}>
          {({ hasReputation }) => (
            <DropdownMenuItem
              onClick={handleEdit}
              disabled={!hasReputation}
              className="cursor-pointer"
            >
              <Edit size={16} />
              {t('main:actions.edit')}
            </DropdownMenuItem>
          )}
        </ReputationGuardTooltip>
        <ReputationGuardTooltip requiredRep={MIN_REPUTATION_REMOVE_SPEAKER}>
          {({ hasReputation }) => (
            <DropdownMenuItem
              onClick={handleRemove}
              disabled={!hasReputation}
              className="cursor-pointer"
            >
              <X size={16} />
              {t('main:actions.remove')}
            </DropdownMenuItem>
          )}
        </ReputationGuardTooltip>
        <ReputationGuardTooltip requiredRep={MIN_REPUTATION_ADD_STATEMENT}>
          {({ hasReputation }) => (
            <DropdownMenuItem
              onClick={handleAddStatement}
              disabled={!hasReputation}
              className="cursor-pointer"
            >
              <MessageCircle size={16} />
              {t('statement.add')}
            </DropdownMenuItem>
          )}
        </ReputationGuardTooltip>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
