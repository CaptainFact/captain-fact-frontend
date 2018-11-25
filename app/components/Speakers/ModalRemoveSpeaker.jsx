import React from 'react'
import { withNamespaces } from 'react-i18next'

import { SpeakerPreview } from './SpeakerPreview'
import ModalConfirmDelete from '../Modal/ModalConfirmDelete'

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

export default withNamespaces('videoDebate')(ModalRemoveSpeaker)
