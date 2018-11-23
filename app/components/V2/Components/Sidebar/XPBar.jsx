import React from 'react'
import Crown from '../../../assets/V2/crown.png'

export default class XPBar extends React.PureComponent {
  state = {
    totalXP: 400
  }

  render() {
    return (
      <span className="xp-total">
        <span
          className="xp-current"
          style={{
            right: `${Math.abs(
              (this.props.value * 100) / this.state.totalXP - 100
            )}%`
          }}
        />
        <span className="xp-current-desc">
          {this.props.value} / {this.state.totalXP}
        </span>
        <svg
          viewBox="0 0 10 20"
          xmlns="http://www.w3.org/2000/svg"
          style={{ left: `${(this.props.value * 100) / this.state.totalXP}%` }}
        >
          <polygon points="0 0, 10 10, 0 20" />
        </svg>
        <img src={Crown} alt="" />
      </span>
    )
  }
}
