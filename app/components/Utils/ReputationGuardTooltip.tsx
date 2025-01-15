import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { useLoggedInUser } from '../LoggedInUser/UserProvider'

export const ReputationGuardTooltip = ({
  requiredRep,
  children,
  tooltipPosition = 'bottom',
}: {
  requiredRep: number
  children: (props: { hasReputation: boolean }) => React.ReactNode
  tooltipPosition?: 'bottom' | 'top' | 'right' | 'left'
}) => {
  const { t } = useTranslation('help')
  const { checkReputation } = useLoggedInUser()
  if (checkReputation(requiredRep)) {
    return children({ hasReputation: true })
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div className="help-tooltip-trigger">{children({ hasReputation: false })}</div>
      </TooltipTrigger>
      <TooltipContent side={tooltipPosition}>
        <Trans i18nKey="errors:client.needReputation" requiredRep={requiredRep}>
          You need at least {{ requiredRep }}
          <Link to="/help/reputation" className="text-white underline">
            {t('pages.reputation').toLowerCase()}
          </Link>
          points to do that
        </Trans>
      </TooltipContent>
    </Tooltip>
  )
}

export default ReputationGuardTooltip
