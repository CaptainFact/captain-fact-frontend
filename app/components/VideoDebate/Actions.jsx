import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import {
  ArrowUpDown,
  Bell,
  BellOff as BellSlash,
  Edit,
  HelpCircle,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { toastError } from '@/lib/toasts'

import { MIN_REPUTATION_UPDATE_VIDEO } from '../../constants'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { Separator } from '../ui/separator'
import ReputationGuard from '../Utils/ReputationGuard'
import ShareModal from '../Utils/ShareModal'
import EditVideoModal from '../Videos/EditVideoModal'
import Action from './ActionButton'

const UPDATE_SUBSCRIPTION_MUTATION = gql`
  mutation UpdateSubscription($entityId: ID!, $scope: String!, $isSubscribed: Boolean!) {
    updateSubscription(entityId: $entityId, scope: $scope, isSubscribed: $isSubscribed) {
      id
      isSubscribed
    }
  }
`

const Actions = ({ video, t, isAuthenticated }) => {
  const history = useHistory()
  const {
    enableAutoscroll: hasAutoscroll,
    enableSoundOnBackgroundFocus: soundOnBackgroundFocus,
    toggleAutoscroll,
    toggleBackgroundSound,
  } = useUserPreferences()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [editVideoModalOpen, setEditVideoModalOpen] = useState(false)
  const [updateSubscription] = useMutation(UPDATE_SUBSCRIPTION_MUTATION)

  // TODO: Fetch subscription status from GraphQL if needed
  // For now, we'll manage it locally via the mutation response

  const handleSubscriptionToggle = async () => {
    if (!video) {
      return
    }
    try {
      const result = await updateSubscription({
        variables: {
          entityId: video.id,
          scope: 'video',
          isSubscribed: !isSubscribed,
        },
      })
      if (result.data?.updateSubscription) {
        setIsSubscribed(result.data.updateSubscription.isSubscribed)
      }
    } catch (error) {
      toastError(error)
    }
  }

  const handleToggleAutoscroll = () => {
    toggleAutoscroll()
  }

  const handleToggleBackgroundSound = () => {
    toggleBackgroundSound()
  }

  const handleEditVideo = () => {
    setEditVideoModalOpen(true)
  }

  const handleShare = () => {
    setShareModalOpen(true)
  }

  const handleHelp = () => {
    history.push('/help')
  }

  if (!video) {
    return null
  }

  return (
    <div className="flex py-[15px] px-2.5 items-center gap-2.5 shadow-[#f3f3f3_0px_10px_10px_-10px] dark:shadow-[rgba(0,0,0,0.3)_0px_10px_10px_-10px] mb-1.5">
      {isAuthenticated && (
        <React.Fragment>
          <Action
            activated={isSubscribed}
            onClick={handleSubscriptionToggle}
            activatedIcon={<Bell />}
            deactivatedIcon={<BellSlash />}
            isSecondary
            label={isSubscribed ? t('video.unsubscribe') : t('video.subscribe')}
          />
          <Separator className="w-px h-5 bg-[#dadada]" />
        </React.Fragment>
      )}

      <Action
        activated={hasAutoscroll}
        onClick={handleToggleAutoscroll}
        activatedIcon={<ArrowUpDown />}
        label={t('statement.autoscroll', {
          context: hasAutoscroll ? 'disable' : 'enable',
        })}
      />
      <Action
        activated={soundOnBackgroundFocus}
        onClick={handleToggleBackgroundSound}
        activatedIcon={<Volume2 />}
        deactivatedIcon={<VolumeX />}
        label={t('statement.soundOnBackgroundFocus', {
          context: soundOnBackgroundFocus ? 'disable' : 'enable',
        })}
      />

      <ReputationGuard requiredRep={MIN_REPUTATION_UPDATE_VIDEO}>
        <Action onClick={handleEditVideo} activatedIcon={<Edit />} label={t('video.edit')} />
      </ReputationGuard>

      <Separator className="w-px h-5 bg-[#dadada]" />

      <Action onClick={handleShare} activatedIcon={<Share2 />} label={t('main:actions.share')} />

      <Action onClick={handleHelp} activatedIcon={<HelpCircle />} label={t('main:menu.help')} />
      <ShareModal open={shareModalOpen} onOpenChange={setShareModalOpen} path={location.pathname} />
      <EditVideoModal
        open={editVideoModalOpen}
        onOpenChange={setEditVideoModalOpen}
        video={video}
      />
    </div>
  )
}

export default withTranslation('videoDebate')(withLoggedInUser(Actions))
