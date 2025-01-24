import { flow } from 'lodash'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
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

import { MIN_REPUTATION_UPDATE_VIDEO } from '../../../constants'
import { addModal } from '../../../state/modals/reducer'
import { toggleAutoscroll, toggleBackgroundSound } from '../../../state/user_preferences/reducer'
import { changeSubscription } from '../../../state/video_debate/effects'
import { destroyStatementForm } from '../../../state/video_debate/statements/effects'
import { changeStatementFormSpeaker } from '../../../state/video_debate/statements/reducer'
import { hasStatementForm } from '../../../state/video_debate/statements/selectors'
import { withLoggedInUser } from '../../LoggedInUser/UserProvider'
import ReputationGuard from '../../Utils/ReputationGuard'
import ShareModal from '../../Utils/ShareModal'
import EditVideoModal from '../../Videos/EditVideoModal'
import Action from './ActionButton'

const Wrapper = styled.div`
  display: flex;
  padding: 15px 10px;
  align-items: center;
  gap: 10px;
  box-shadow: #f3f3f3 0px 10px 10px -10px;
  margin-bottom: 5px;
`

const Separator = styled.div`
  width: 1px;
  height: 20px;
  background: ${({ theme }) => theme.colors.black[200]};
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
  history,
}) => (
  <Wrapper>
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
        <Separator />
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
        onClick={() => addModal({ Modal: EditVideoModal })}
        activatedIcon={<PencilAlt />}
        label={t('video.edit')}
      />
    </ReputationGuard>

    <Separator />

    <Action
      onClick={() =>
        addModal({
          Modal: ShareModal,
          props: { path: location.pathname },
        })
      }
      activatedIcon={<ShareAlt />}
      label={t('main:actions.share')}
    />

    <Action
      onClick={() => history.push('/help')}
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

const ConnectedActions = flow(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation('videoDebate'),
  withRouter,
  withLoggedInUser,
)(Actions)

export default ConnectedActions
