import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { ENTITY_STATEMENT } from '../../constants'
import { addModal } from '../../state/modals/reducer'
import { setScrollTo } from '../../state/video_debate/statements/reducer'
import { forcePosition } from '../../state/video_debate/video/reducer'
import ShareModal from '../Utils/ShareModal'
import { ModalHistory } from '../VideoDebate/ModalHistory'
import StatementHeader from './StatementHeader'

@connect(null, { addModal, forcePosition, setScrollTo })
@withTranslation('videoDebate')
export default class Statement extends React.PureComponent {
  render() {
    const { statement, speaker, handleEdit, handleDelete, withoutActions, offset = 0 } = this.props

    return (
      <div>
        <StatementHeader
          statementTime={statement.time + offset}
          isDraft={statement.is_draft}
          speaker={speaker}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleShowHistory={() => this.showHistory()}
          handleTimeClick={withoutActions ? null : this.handleTimeClick}
          handleShare={() => this.shareModal()}
          withoutActions={withoutActions}
          customButtons={this.props.customButtons}
        />
        <div className="bg-[#31455d] text-white p-5 shadow-inner flex items-start gap-4">
          <span className="h-[50px] -mt-2 sm:text-7xl text-5xl font-serif text-neutral-300">“</span>
          <blockquote className="text-lg italic py-1">{statement.text}</blockquote>
        </div>
      </div>
    )
  }

  handleTimeClick = (time) => {
    this.props.forcePosition(time)
    this.props.setScrollTo({
      id: this.props.statement.id,
      __forceAutoScroll: true,
    })
  }

  shareModal() {
    this.props.addModal({
      Modal: ShareModal,
      props: {
        path: `${location.pathname}?statement=${this.props.statement.id}`,
      },
    })
  }

  showHistory() {
    this.props.addModal({
      Modal: ModalHistory,
      props: {
        entity: ENTITY_STATEMENT,
        entityId: this.props.statement.id,
      },
    })
  }
}
