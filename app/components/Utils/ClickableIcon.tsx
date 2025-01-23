import React from 'react'

import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

const ClickableIcon = ({
  size = 'icon',
  variant = 'outline',
  icon = null,
  title,
  ...btnProps
}: {
  icon: React.ReactNode
  title: string
} & React.ComponentProps<typeof Button>) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button size={size} variant={variant} {...btnProps}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  )
}

export default ClickableIcon
