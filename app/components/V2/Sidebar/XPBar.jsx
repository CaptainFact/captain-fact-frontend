import React from 'react'
import Link from 'react-router'

export default class XPBar extends React.PureComponent {
  state = {
    totalXP: 400,
    currentXP: 40
  }

  render() {
    return (
      <span className="xp-total">
        <span className="xp-current" style={{ right: `${this.state.currentXP}px` }}/>
        <span className="xp-current-desc">50XP / {this.state.currentXP}</span>
        <svg viewBox="0 0 10 20" xmlns="http://www.w3.org/2000/svg" style={{ right: `${this.state.currentXP - 10}px` }}>
          <polygon points="0 0, 10 10, 0 20" />
        </svg>
      </span>
    )
  }
}
