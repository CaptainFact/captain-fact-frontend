import React from 'react'
import { Trans } from 'react-i18next'

import { toast } from '@/hooks/use-toast'
import { toastError } from '@/lib/toasts'

import { SocketApi } from '../../API'
import { VIDEO_DEBATE_CHANNEL } from '../../constants'
import { createEffect, generateFSAError } from '../utils'
import { presenceDiff, setPresence } from './presence/reducer'
import * as videoReducer from './video/reducer'

export const joinVideoDebateChannel = (videoId) => (dispatch) => {
  // Connect to channel
  dispatch(videoReducer.setLoading(true))
  dispatch(
    videoReducer.fetchAll(
      SocketApi.joinChannel(VIDEO_DEBATE_CHANNEL, `${VIDEO_DEBATE_CHANNEL}:${videoId}`, {
        speaker_added: (s) => dispatch(videoReducer.addSpeaker(s)),
        speaker_removed: (s) => dispatch(videoReducer.removeSpeaker(s)),
        speaker_updated: (s) => dispatch(videoReducer.updateSpeaker(s)),
        presence_state: (s) => dispatch(setPresence(s)),
        presence_diff: (s) => dispatch(presenceDiff(s)),
        video_updated: ({ video }) => dispatch(videoReducer.updateVideo(video)),
      }),
    ),
  )
}

export const leaveVideoDebateChannel = () => () => {
  return SocketApi.leaveChannel(VIDEO_DEBATE_CHANNEL)
}

export const addSpeaker = (speaker) => {
  return createEffect(SocketApi.push(VIDEO_DEBATE_CHANNEL, 'new_speaker', speaker), {
    catch: toastError,
  })
}

export const removeSpeaker = (speaker) => {
  return createEffect(SocketApi.push(VIDEO_DEBATE_CHANNEL, 'remove_speaker', speaker), {
    catch: toastError,
    then: () => {
      toast({
        variant: 'success',
        title: <Trans i18nKey="videoDebate:speaker.removed">Speaker removed</Trans>,
        description: (
          <Trans i18nKey="videoDebate:speaker.removed_description">
            {{ name: speaker.full_name }} has been removed from the speakers
          </Trans>
        ),
      })
    },
  })
}

export const updateSpeaker = (speaker) => {
  return createEffect(SocketApi.push(VIDEO_DEBATE_CHANNEL, 'update_speaker', speaker), {
    catch: generateFSAError,
  })
}

/**
 * Shift all video's statements
 *
 * @param {object} offsets a map of offsets
 *
 * ## Examples
 * > shiftStatements({youtube_offset: 42})
 */
export const shiftStatements = (offsets) => {
  return createEffect(SocketApi.push(VIDEO_DEBATE_CHANNEL, 'shift_statements', offsets), {
    catch: toastError,
  })
}

/** Subscribe or unsubscribe a user from given video */
export const changeSubscription = (newValue) => {
  return SocketApi.push(VIDEO_DEBATE_CHANNEL, 'change_subscription', {
    subscribed: newValue,
  })
    .then(() => {
      return videoReducer.setSubscription(newValue)
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e)
    })
}
