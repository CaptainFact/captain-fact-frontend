import React from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { flow } from 'lodash'
import styled from 'styled-components'
import { withRouter } from 'react-router'

import {
  BellSlash,
  Bell,
  ArrowsAltV,
  VolumeMute,
  VolumeUp,
  ShareAlt,
  PencilAlt,
  Question,
} from 'styled-icons/fa-solid'

import { hasStatementForm } from '../../../state/video_debate/statements/selectors'
import { destroyStatementForm } from '../../../state/video_debate/statements/effects'
import { changeSubscription } from '../../../state/video_debate/effects'
import { changeStatementFormSpeaker } from '../../../state/video_debate/statements/reducer'
import { toggleAutoscroll, toggleBackgroundSound } from '../../../state/user_preferences/reducer'
import { addModal } from '../../../state/modals/reducer'
import { MIN_REPUTATION_UPDATE_VIDEO } from '../../../constants'
import { withLoggedInUser } from '../../LoggedInUser/UserProvider'
import ReputationGuard from '../../Utils/ReputationGuard'
import ShareModal from '../../Utils/ShareModal'
import EditVideoModal from '../../Videos/EditVideoModal'

import Action from './Action'

const Wrapper = styled.div`
  display: flex;
  padding: 15px 10px 0 10px;
`

const StyledAction = styled(Action)`
  margin: 0 10px 0 0;

  &:last-child {
    margin-right: 0;
  }
`

const Actions = ({
  t,
  isAuthenticated,
  isSubscribed,
  changeSubscription,
  hasAutoscroll,
  toggleAutoscroll,
  soundOnBackgroundFocus,
  toggleBackgroundSound,
  addModal,
  router,
}) => (
  <Wrapper>
    {isAuthenticated && (
      <StyledAction
        activated={isSubscribed}
        onClick={() => changeSubscription(!isSubscribed)}
        activatedIcon={<Bell />}
        deactivatedIcon={<BellSlash />}
      />
    )}

    <StyledAction
      activated={hasAutoscroll}
      onClick={() => toggleAutoscroll()}
      activatedIcon={<ArrowsAltV />}
      label={t('statement.autoscroll', {
        context: hasAutoscroll ? 'disable' : 'enable',
      })}
    />
    <StyledAction
      activated={soundOnBackgroundFocus}
      onClick={() => toggleBackgroundSound()}
      activatedIcon={<VolumeUp />}
      deactivatedIcon={<VolumeMute />}
      label={t('statement.soundOnBackgroundFocus', {
        context: soundOnBackgroundFocus ? 'disable' : 'enable',
      })}
    />
    <StyledAction
      onClick={() =>
        addModal({
          Modal: ShareModal,
          props: { path: location.pathname },
        })
      }
      activatedIcon={<ShareAlt />}
      label={t('main:actions.share')}
    />
    <ReputationGuard requiredRep={MIN_REPUTATION_UPDATE_VIDEO}>
      <StyledAction
        onClick={() => addModal({ Modal: EditVideoModal })}
        activatedIcon={<PencilAlt />}
        label={t('video.edit')}
      />
    </ReputationGuard>
    <StyledAction
      onClick={() => router.push('/help')}
      activatedIcon={<Question />}
      label={t('main:menu.help')}
    />
  </Wrapper>
)

const mapStateToProps = (state) => ({
  hasAutoscroll: state.UserPreferences.enableAutoscroll,
  soundOnBackgroundFocus: state.UserPreferences.enableSoundOnBackgroundFocus,
  isSubscribed: state.VideoDebate.video.isSubscribed,
  hasStatementForm: hasStatementForm(state),
})

const mapDispatchToProps = {
  changeStatementFormSpeaker,
  toggleAutoscroll,
  toggleBackgroundSound,
  addModal,
  destroyStatementForm,
  // @deprecated: use updateSubscription GraphQL mutation instead
  changeSubscription,
}

export default flow(
  connect(mapStateToProps, mapDispatchToProps),
  withNamespaces('videoDebate'),
  withRouter,
  withLoggedInUser
)(Actions)
