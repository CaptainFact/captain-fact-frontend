import React from "react"
import { translate } from 'react-i18next'

import { SpeakerPreview } from './SpeakerPreview'
import ModalConfirmDelete from '../Modal/ModalConfirmDelete'


const ModalRemoveSpeaker = ({handleAbort, speaker, t, ...props}) =>
  <ModalConfirmDelete handleAbort={handleAbort}
                      title={t('speaker.remove')}
                      isRemove={true}
                      content={(<SpeakerPreview speaker={speaker} withoutActions={true}/>)}
                      message={t('speaker.confirmRemove', {speaker})}
                      {...props}
  />

export default translate('videoDebate')(ModalRemoveSpeaker)