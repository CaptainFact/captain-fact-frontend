import { DialogDescription } from '@radix-ui/react-dialog'
import { CircleHelp } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/css-utils'

import { popModal } from '../../state/modals/reducer'

const Modal = ({
  helpLink,
  popModal,
  isActive = true,
  title = null,
  description = null,
  children = null,
  footer = null,
  className = null,
  isAbsolute = false,
  handleCloseClick = null,
}) => {
  const { t } = useTranslation()
  return (
    <Dialog open={isActive} onOpenChange={() => (handleCloseClick || popModal)()}>
      <DialogContent className={cn(className, { fixed: isAbsolute })}>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {(description || helpLink) && (
              <DialogDescription>
                {helpLink ? (
                  <Link to={helpLink} target="_blank">
                    <CircleHelp className="inline" size={16} />{' '}
                    {description || t('help:pages.about')}
                  </Link>
                ) : (
                  description
                )}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="py-4">{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

export default connect(null, { popModal })(Modal)
