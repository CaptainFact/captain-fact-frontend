import React from 'react'
import { withTranslation } from 'react-i18next'

import ModalConfirmDelete from '../Modal/ModalConfirmDelete'
import { SpeakerPreview } from './SpeakerPreview'

const ModalRemoveSpeaker = ({ handleAbort, speaker, t, ...props }) => (
  <ModalConfirmDelete
    handleAbort={handleAbort}
    title={t('speaker.remove')}
    isRemove
    content={<SpeakerPreview speaker={speaker} withoutActions />}
    message={t('speaker.confirmRemove', { speaker })}
    {...props}
  />
)

export default withTranslation('videoDebate')(ModalRemoveSpeaker)
