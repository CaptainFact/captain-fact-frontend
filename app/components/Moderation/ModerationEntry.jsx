import React from "react"
import { connect } from "react-redux"
import { translate } from 'react-i18next'

import { History } from '../UsersActions/History'
import { fetchRandomModeration } from '../../state/moderation/effects'

import Entity from '../UsersActions/Entity'
import { UserAction } from "../UsersActions/UserAction";

export default class ModerationEntry extends React.PureComponent {

  render() {
    const { entry } = this.props

    return (

      <div className="moderation-entry">
        { JSON.stringify(entry.toJSON()) }
        <br/>
        <br/>
        <div className="moderation-header">
          <span>Date: 1234</span>
          <span>
            Reported for :
                    <span>spam</span>
          </span>
          <UserAction action={entry}></UserAction>
          <a>show full history</a>
          {/* <History></History> //if button clicked */}
          <div className="history-entry-buttons">
            <button>abusive flag</button>
            <button>not sure</button>
            <button>confirm</button>
          </div>
        </div>
      </div>
    )
  }
}