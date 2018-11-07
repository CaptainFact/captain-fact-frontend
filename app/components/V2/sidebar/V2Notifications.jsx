import React from 'react'

import NotificationImg from '../../../assets/V2/notification.png'

export default class V2Notifications extends React.PureComponent {
  render() {
    return (
      <a href="#" className="notificationV2">
        <img src={NotificationImg} alt="" />
        <span className="count">{this.props.count}</span>
      </a>
    )
  }
}
