import classNames from 'classnames'
import React from 'react'
import { withNamespaces } from 'react-i18next'

import ClickableIcon from '../Utils/ClickableIcon'
import IconModerationPending from './IconModerationPending'

const Score = ({ isVoting, isReported, score }) => {
  if (isVoting) {
    return <span className="round-spinner" />
  }
  if (isReported) {
    return <IconModerationPending />
  }
  return score
}

const Vote = ({ isVoting, score, myVote, onVote, isReported }) => (
  <figure>
    <div className="vote">
      <ClickableIcon
        name="chevron-up"
        className={classNames({ selected: myVote > 0 })}
        onClick={() => (myVote <= 0 ? onVote(1) : onVote(0))}
      />
      <div className="score">
        <Score isVoting={isVoting} isReported={isReported} score={score} />
      </div>
      <ClickableIcon
        name="chevron-down"
        className={classNames({ selected: myVote < 0 })}
        onClick={() => (myVote >= 0 ? onVote(-1) : onVote(0))}
      />
    </div>
  </figure>
)

export default withNamespaces('modetation')(Vote)
