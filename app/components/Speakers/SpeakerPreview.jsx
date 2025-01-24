import { AvatarFallback } from '@radix-ui/react-avatar'
import { Mic } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

import { cn } from '@/lib/css-utils'

import { addModal } from '../../state/modals/reducer'
import { removeSpeaker } from '../../state/video_debate/effects'
import { changeStatementFormSpeaker } from '../../state/video_debate/statements/reducer'
import { getFocusedStatementSpeakerId } from '../../state/video_debate/statements/selectors'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { Avatar, AvatarImage } from '../ui/avatar'
import EditSpeakerFormModal from './EditSpeakerFormModal'
import ModalRemoveSpeaker from './ModalRemoveSpeaker'
import { SpeakerDropdownMenu } from './SpeakerDropdownMenu'

@withRouter
@withTranslation('videoDebate')
@connect(
  (state, props) => ({
    isFocused: getFocusedStatementSpeakerId(state) === props.speaker.id,
  }),
  { addModal, changeStatementFormSpeaker, removeSpeaker },
)
@withLoggedInUser
export class SpeakerPreview extends React.PureComponent {
  render() {
    const { speaker, isAuthenticated, withoutActions, className, isFocused } = this.props

    return (
      <div
        className={cn(
          'flex items-center animate-fadeInUp justify-between gap-2',
          { 'speaker-pulse': isFocused },
          className,
        )}
      >
        <div className="flex items-center">
          <div className="flex-none w-[50px] flex justify-center items-center mr-3">
            {this.renderSpeakerThumb(speaker)}
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            {this.renderName(speaker)}
            <p className="sm:text-sm max-w-full text-xs text-neutral-600">
              {speaker.title || '...'}
            </p>
          </div>
        </div>
        <div className="flex">
          {isAuthenticated && !withoutActions && (
            <SpeakerDropdownMenu
              handleRemove={() => this.handleRemove()}
              handleEdit={() => this.handleEdit()}
              handleAddStatement={() => this.handleAddStatement()}
            />
          )}
        </div>
      </div>
    )
  }

  renderSpeakerThumb(speaker) {
    return (
      <Avatar className="bg-white rounded-full flex items-center justify-center border border-neutral-200">
        <AvatarImage src={speaker.picture} />
        <AvatarFallback>
          <Mic className="text-neutral-600" />
        </AvatarFallback>
      </Avatar>
    )
  }

  renderName(speaker) {
    return (
      <Link
        to={`/s/${speaker.slug || speaker.id}`}
        className={'sm:font-medium sm:text-base text-sm hover:underline text-neutral-900'}
        target="_blank"
      >
        {speaker.full_name}
      </Link>
    )
  }

  handleRemove() {
    this.props.addModal({
      Modal: ModalRemoveSpeaker,
      props: {
        speaker: this.props.speaker,
        handleConfirm: () => this.props.removeSpeaker(this.props.speaker),
      },
    })
  }

  handleEdit() {
    this.props.addModal({
      Modal: EditSpeakerFormModal,
      props: { speaker: this.props.speaker.toJS() },
    })
  }

  handleAddStatement() {
    const historyRegex = new RegExp('/history/?$')
    const currentPath = this.props.location.pathname
    if (currentPath.match(historyRegex)) {
      this.props.history.push(currentPath.replace(historyRegex, ''))
    }
    this.props.changeStatementFormSpeaker({ id: this.props.speaker.id })
  }
}
