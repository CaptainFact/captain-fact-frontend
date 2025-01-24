import { MIN_REPUTATION_REMOVE_STATEMENT, MIN_REPUTATION_UPDATE_STATEMENT } from 'app/constants'
import { CircleX, Edit, History, MoreHorizontal, Share2 } from 'lucide-react'
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

export const StatementDropdownMenu = ({
  isDraft,
  handleDelete,
  handleEdit,
  handleShowHistory,
  handleShare,
}) => {
  const { t } = useTranslation('videoDebate')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="icon-xs">
          <MoreHorizontal size="1em" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ReputationGuardTooltip
          requiredRep={MIN_REPUTATION_UPDATE_STATEMENT}
          tooltipPosition="left"
        >
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
        {!isDraft && (
          <React.Fragment>
            <ReputationGuardTooltip
              requiredRep={MIN_REPUTATION_REMOVE_STATEMENT}
              tooltipPosition="left"
            >
              {({ hasReputation }) => (
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={!hasReputation}
                  className="cursor-pointer"
                >
                  <CircleX size={18} />
                  {t('main:actions.remove')}
                </DropdownMenuItem>
              )}
            </ReputationGuardTooltip>
            <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
              <Share2 size={16} />
              {t('main:actions.share')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShowHistory} className="cursor-pointer">
              <History size={16} />
              {t('history')}
            </DropdownMenuItem>
          </React.Fragment>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
