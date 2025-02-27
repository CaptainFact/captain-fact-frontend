import { destroy } from 'redux-form'

import { toastError } from '@/lib/toasts'

import { SocketApi } from '../../../API'
import { STATEMENTS_CHANNEL } from '../../../constants'
import { createEffect, returnSuccess } from '../../utils'
import {
  add,
  fetchStatements,
  remove,
  setLoading,
  setSubmitting,
  update,
  updateAll,
} from './reducer'

export const joinStatementsChannel = (videoId) => (dispatch) => {
  // Connect to channel
  dispatch(setLoading(true))
  dispatch(
    fetchStatements(
      SocketApi.joinChannel(STATEMENTS_CHANNEL, `${STATEMENTS_CHANNEL}:video:${videoId}`, {
        statement_removed: (s) => dispatch(remove(s)),
        statement_added: (s) => dispatch(add(s)),
        statement_updated: (s) => dispatch(update(s)),
        statements_updated: ({ statements }) => dispatch(updateAll(statements)),
      }),
    ),
  )
}

export const leaveStatementsChannel = () => () => {
  return SocketApi.leaveChannel(STATEMENTS_CHANNEL)
}

export const postStatement = (statement) =>
  createEffect(SocketApi.push(STATEMENTS_CHANNEL, 'new_statement', statement), {
    before: setSubmitting(true),
    then: [setSubmitting(false), returnSuccess],
    catch: [setSubmitting(false), toastError],
  })

export const updateStatement = (statement) =>
  createEffect(SocketApi.push(STATEMENTS_CHANNEL, 'update_statement', statement), {
    catch: toastError,
  })

export const deleteStatement = (statement) =>
  createEffect(SocketApi.push(STATEMENTS_CHANNEL, 'remove_statement', statement), {
    catch: toastError,
  })

export const destroyStatementForm = () => destroy('StatementForm')
