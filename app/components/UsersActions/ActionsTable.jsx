import Immutable from 'immutable'
import { Indent, Undo } from 'lucide-react'
import PropTypes from 'prop-types'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ACTION_DELETE, ACTION_REMOVE } from '../../constants'
import { revertVideoDebateUserAction } from '../../state/video_debate/history/effects'
import { Button } from '../ui/button'
import UserAppellation from '../Users/UserAppellation'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { TimeSince } from '../Utils/TimeSince'
import ActionDiff from './ActionDiff'
import ActionEntityLink from './ActionEntityLink'
import ActionIcon from './ActionIcon'

@withTranslation('history')
@connect(
  (state) => ({
    lastActionsIds: state.UsersActions.lastActionsIds,
  }),
  { revertVideoDebateUserAction },
)
class ActionsTable extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { expendedDiffs: new Immutable.List() }
  }

  render() {
    return (
      <Table>
        <TableHeader>{this.renderHeader()}</TableHeader>
        <TableBody>{this.renderBody()}</TableBody>
      </Table>
    )
  }

  // ---- Table header ----

  renderHeader = () => {
    const { t, showEntity } = this.props
    return (
      <TableRow>
        <TableHead>{t('when')}</TableHead>
        <TableHead>{t('who')}</TableHead>
        <TableHead>Action</TableHead>
        {showEntity && <TableHead>{t('entity')}</TableHead>}
        <TableHead>{t('main:actions.all')}</TableHead>
      </TableRow>
    )
  }

  collapseDiffs() {
    this.setState((prevState) => ({
      expendedDiffs: prevState.expendedDiffs.clear(),
    }))
  }

  // ---- Table body ----

  renderBody = () => {
    if (this.props.isLoading) {
      return (
        <TableRow style={{ background: 'none' }}>
          <TableCell colSpan={this.getNbCols()}>
            <LoadingFrame />
          </TableCell>
        </TableRow>
      )
    }
    return this.props.actions.map((a) => this.renderAction(a))
  }

  renderAction = (action) => {
    if (this.state.expendedDiffs.includes(action.id)) {
      return [this.renderActionLine(action, true), this.renderDiffLine(action)]
    }
    return this.renderActionLine(action)
  }

  renderActionLine(action, isDiffing = false) {
    const { showEntity, t } = this.props
    const isLastActionForEntity = this.props.lastActionsIds.includes(action.id)
    const isReversibleType = [ACTION_DELETE, ACTION_REMOVE].includes(action.type)
    const reversible = isLastActionForEntity && isReversibleType

    return (
      <TableRow key={action.id}>
        <TableCell>
          <TimeSince time={action.time} />
        </TableCell>
        <TableCell>{this.renderUser(action.user)}</TableCell>
        <TableCell>
          <ActionIcon className="inline" type={action.type} />
          <strong> {t(`action.${action.type}`)}</strong>
        </TableCell>
        {showEntity && (
          <TableCell>
            <ActionEntityLink action={action} />
          </TableCell>
        )}
        <TableCell>
          <Button variant="outline" size="xs" onClick={() => this.toggleDiff(action, isDiffing)}>
            <Indent size="1em" />
            <span>{t(isDiffing ? 'compare_hide' : 'compare_show')} </span>
          </Button>
          {reversible && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => this.props.revertVideoDebateUserAction(action)}
              className="ml-2"
            >
              <Undo size="1em" />
              <span>{t('revert')}</span>
            </Button>
          )}
        </TableCell>
      </TableRow>
    )
  }

  renderUser = (user) => <UserAppellation user={user} compact />

  renderDiffLine = (action) => (
    <TableRow key={`${action.id}-diff`}>
      <TableCell colSpan={this.getNbCols()} style={{ padding: 0 }}>
        <ActionDiff action={action} allActions={this.props.actions} />
      </TableCell>
    </TableRow>
  )

  toggleDiff = (action, isDiffing) => {
    if (isDiffing) {
      const actionIdx = this.state.expendedDiffs.findIndex((id) => id === action.id)
      this.setState((prevState) => ({
        expendedDiffs: prevState.expendedDiffs.delete(actionIdx),
      }))
    } else {
      this.setState((prevState) => ({
        expendedDiffs: prevState.expendedDiffs.push(action.id),
      }))
    }
  }

  getNbCols = () => 7 - !this.props.showEntity
}

ActionsTable.defaultProps = {
  isLoading: false,
  showRestore: true,
  showEntity: true,
}

ActionsTable.propTypes = {
  actions: PropTypes.instanceOf(Immutable.List).isRequired,
  isLoading: PropTypes.bool,
  showRestore: PropTypes.bool,
  showEntity: PropTypes.bool,
}

export default ActionsTable
