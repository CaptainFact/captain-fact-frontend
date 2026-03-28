/**
 * This file doesn't really contain a reducer, it's acts a a smooth interface to
 * transition to shadcn toasts.
 */

import { Ghost } from 'lucide-react'
import React from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'

import { getErrorInfo, normalizeServerErrorMessage } from './errors'
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
  if (typeof error === 'object' && error !== null) {
    // Handle GraphQL errors - extract message from graphQLErrors array
    if (error.cause?.message) {
      error = error.cause.message
    } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      error = error.graphQLErrors[0].message || error.message || 'unexpected'
    } else if (error.networkError) {
      error = error.networkError.message || error.message || 'unexpected'
    } else {
      error = error.message || 'unexpected'
    }
  }

  if (typeof error === 'string') {
    error = normalizeServerErrorMessage(error)
  }

  const errorInfo = getErrorInfo(error)
  let action = null
  if (errorInfo) {
    action = toast({
      variant: 'error',
      title: <Trans i18nKey="errors:title" />,
      description: (
        <div>
          {errorInfo.i18nKey && (
            <p className="block mb-1">
              <Trans i18nKey={errorInfo.i18nKey} />
            </p>
          )}
          {errorInfo.url && (
            <Link className="block underline" to={errorInfo.url}>
              <Trans i18nKey={'actions.moreInfo'} />
            </Link>
          )}
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
