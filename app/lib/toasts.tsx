/**
 * This file doesn't really contain a reducer, it's acts a a smooth interface to
 * transition to shadcn toasts.
 */

import { Ghost, Link } from 'lucide-react'
import React from 'react'
import { Trans } from 'react-i18next'

import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'

import { getErrorInfo } from './errors'
import { WithRouterForRenderProp } from './router'

export const toastErrorUnauthenticated = () => {
  return toast({
    variant: 'default',
    title: (
      <div className="flex items-center gap-2">
        <Ghost size={16} />
        <span>
          <Trans i18nKey="main:disconnected" />
        </span>
      </div>
    ),
    description: <Trans i18nKey="errors:server.unauthenticated" />,
    action: (
      <WithRouterForRenderProp>
        {({ router }) => (
          <ToastAction altText="Sign In" onClick={() => router.history.push('/login')}>
            <Trans i18nKey="main:menu.login" />
          </ToastAction>
        )}
      </WithRouterForRenderProp>
    ),
  })
}

export function toastError(error) {
  if (typeof error === 'object' && error !== null && error.message) {
    error = error.message
  }

  const errorInfo = getErrorInfo(error)
  let action = null
  if (errorInfo) {
    action = toast({
      variant: 'error',
      title: <Trans i18nKey="errors:title" />,
      description: (
        <div>
          <p className="block mb-1">{error}</p>
          <Link className="block" to={errorInfo.url}>
            <Trans i18nKey={errorInfo.i18nKey || 'actions.moreInfo'} />
          </Link>
        </div>
      ),
    })
  } else if (typeof error === 'string' && error !== 'unexpected') {
    action = toast({
      variant: 'error',
      title: <Trans i18nKey="errors:title" />,
      description: (
        <Trans
          i18nKey={[`errors:server.${error}`, `errors:client.${error}`, 'errors:server.unknown']}
        />
      ),
    })
  } else {
    action = toast({
      variant: 'error',
      title: <Trans i18nKey="errors:title" />,
      description: <Trans i18nKey="errors:server.unknown" />,
    })
  }

  action.error = true
  return action
}
