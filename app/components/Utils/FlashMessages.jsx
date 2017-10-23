import React from "react"
import { connect } from "react-redux"

import { Icon } from "./Icon"
import { translate } from 'react-i18next'
import FlipMove from 'react-flip-move'
import { Link } from 'react-router'
import { addFlash, pause, removeFlash, unPause, update } from '../../state/flashes/reducer'
import { tError } from '../../lib/errors'
import { popModal } from '../../state/modals/reducer'


const UPDATE_INTERVAL = 1000

@connect(
  ({Flashes: {flashes, isPaused}}) => ({flashes, isPaused}),
  {addFlash, removeFlash, pause, unPause, update}
)
export class FlashMessages extends React.PureComponent {
  constructor(props) {
    super(props)
    this.interval = null
  }

  componentDidUpdate() {
    if (this.props.flashes.size === 0 || this.props.isPaused)
      this.clearUpdateInterval()
    else
      this.setUpdateInterval()
  }

  setUpdateInterval() {
    if (this.interval === null) {
      this.interval = setInterval(() => this.props.update(UPDATE_INTERVAL), UPDATE_INTERVAL)
    }
  }

  clearUpdateInterval() {
    if (this.interval !== null) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  render() {
    if (this.props.flashes.size === 0)
      return null

    return (
      <div id="flash-messages"
          onMouseEnter={() => this.props.pause()}
          onMouseLeave={() => this.props.unPause()}>
        <FlipMove enterAnimation="fade">
          {this.props.flashes.map(flash =>
            <div key={flash.id} className={`flash-message is-${flash.flashType}`}
                data-timeleft={flash.timeLeft}>
              <button className="delete" onClick={() => this.props.removeFlash(flash)}/>
              <FlashContent flash={flash}/>
            </div>
          )}
        </FlipMove>
      </div>
    )
  }
}


@translate(['main', 'errors'])
@connect(null, {popModal, removeFlash})
class FlashContent extends React.PureComponent {
  shouldComponentUpdate(nextProps) {
    // To avoid re-rendering every second, we only compare flash id
    return this.props.flash.id !== nextProps.flash.id ||
           this.props.i18nLoadedAt !== nextProps.i18nLoadedAt
  }

  render() {
    const {iconName, message, isError} = this.props.flash
    return (
      <div className="columns">
        { iconName &&
        <div className="column is-narrow">
          <Icon size="medium" name={iconName}/>
        </div>
        }
        <div className="column">
          <div>
            { isError ? tError(this.props.t, message) : this.props.t(message) }
          </div>
          {this.renderInfoLink()}
        </div>
      </div>
    )
  }

  renderInfoLink() {
    let {infoUrl, infoText} = this.props.flash
    let onClick = () => {
      this.props.popModal()
      this.props.removeFlash(this.props.flash)
    }

    if (!infoUrl && !infoText)
      return null

    // Special case for reload
    if (infoText === 'actions.reload') {
      infoUrl = location.href
      onClick = () => location.reload()
    }

    return (
      <Link className="more-info-link" to={infoUrl} onClick={onClick}>
        {infoText ? this.props.t(infoText) : this.props.t('actions.moreInfo')}
      </Link>
    )
  }
}
