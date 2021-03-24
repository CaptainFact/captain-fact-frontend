import React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import { ModalHistory } from '../VideoDebate/ModalHistory'
import { addModal } from '../../state/modals/reducer'
import { forcePosition } from '../../state/video_debate/video/reducer'
import ShareModal from '../Utils/ShareModal'
import { ENTITY_STATEMENT } from '../../constants'
import { setScrollTo } from '../../state/video_debate/statements/reducer'
import StatementHeader from './StatementHeader'

@connect(null, { addModal, forcePosition, setScrollTo })
@withNamespaces('videoDebate')
export default class Statement extends React.PureComponent {
  render() {
    const { statement, speaker, handleEdit, handleDelete, withoutActions, offset = 0 } = this.props

    return (
      <div>
        <StatementHeader
          statementTime={statement.time + offset}
          speaker={speaker}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleShowHistory={() => this.showHistory()}
          handleTimeClick={withoutActions ? null : this.handleTimeClick}
          handleShare={() => this.shareModal()}
          withoutActions={withoutActions}
        />
        <div className="card-content statement-text-container">
          <h3 className="statement-text">{statement.text}</h3>
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
