import { flow } from 'lodash'
import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  ArrowsAltV,
  Bell,
  BellSlash,
  PencilAlt,
  Question,
  ShareAlt,
  VolumeMute,
  VolumeUp,
} from 'styled-icons/fa-solid'

import { useUserPreferences } from '../../../contexts/UserPreferencesContext'
import { MIN_REPUTATION_UPDATE_VIDEO } from '../../../constants'
import { addModal } from '../../../state/modals/reducer'
import ShareModal from '../../Utils/ShareModal'
import EditVideoModal from '../../Videos/EditVideoModal'
import { changeSubscription } from '../../../state/video_debate/effects'
import { destroyStatementForm } from '../../../state/video_debate/statements/effects'
import { changeStatementFormSpeaker } from '../../../state/video_debate/statements/reducer'
import { hasStatementForm } from '../../../state/video_debate/statements/selectors'
import { shiftStatements } from '../../../state/video_debate/effects'
import { withLoggedInUser } from '../../LoggedInUser/UserProvider'
import { Separator } from '../../ui/separator'
import ReputationGuard from '../../Utils/ReputationGuard'
import Action from './ActionButton'

const Actions = ({
  t,
  isAuthenticated,
  isSubscribed,
  changeSubscription,
  addModal,
  history,
  video,
}) => {
  const {
    enableAutoscroll: hasAutoscroll,
    enableSoundOnBackgroundFocus: soundOnBackgroundFocus,
    toggleAutoscroll,
    toggleBackgroundSound,
  } = useUserPreferences()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [editVideoModalOpen, setEditVideoModalOpen] = useState(false)

  return (
  <div className="flex py-[15px] px-2.5 items-center gap-2.5 shadow-[#f3f3f3_0px_10px_10px_-10px] dark:shadow-[rgba(0,0,0,0.3)_0px_10px_10px_-10px] mb-1.5">
    {isAuthenticated && (
      <React.Fragment>
        <Action
          activated={isSubscribed}
          onClick={() => changeSubscription(!isSubscribed)}
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
        onClick={() => toggleAutoscroll()}
        activatedIcon={<ArrowsAltV />}
        label={t('statement.autoscroll', {
          context: hasAutoscroll ? 'disable' : 'enable',
        })}
      />
      <Action
        activated={soundOnBackgroundFocus}
        onClick={() => toggleBackgroundSound()}
        activatedIcon={<VolumeUp />}
        deactivatedIcon={<VolumeMute />}
        label={t('statement.soundOnBackgroundFocus', {
          context: soundOnBackgroundFocus ? 'disable' : 'enable',
        })}
      />

      <ReputationGuard requiredRep={MIN_REPUTATION_UPDATE_VIDEO}>
        <Action
          onClick={() => setEditVideoModalOpen(true)}
          activatedIcon={<PencilAlt />}
          label={t('video.edit')}
        />
      </ReputationGuard>

      <Separator className="w-px h-5 bg-[#dadada]" />

      <Action
        onClick={() => setShareModalOpen(true)}
        activatedIcon={<ShareAlt />}
        label={t('main:actions.share')}
      />

      <Action
        onClick={() => history.push('/help')}
        activatedIcon={<Question />}
        label={t('main:menu.help')}
      />
      <ShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        path={location.pathname}
      />
      {video && (
        <EditVideoModal
          open={editVideoModalOpen}
          onOpenChange={setEditVideoModalOpen}
          video={video}
          shiftStatements={shiftStatements}
        />
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  isSubscribed: state.VideoDebate.video.isSubscribed,
  hasStatementForm: hasStatementForm(state),
  video: state.VideoDebate.video.data,
})

const mapDispatchToProps = {
  changeStatementFormSpeaker,
  addModal,
  destroyStatementForm,
  // @deprecated: use updateSubscription GraphQL mutation instead
  changeSubscription,
}

const ConnectedActions = flow(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation('videoDebate'),
  withRouter,
  withLoggedInUser,
)(Actions)

export default ConnectedActions
