import React from 'react'
import classNames from 'classnames'

import ClickableIcon from '../Utils/ClickableIcon'


const Vote = ({isVoting, score, myVote, onVote}) => (
  <figure>
    <div className="vote">
      <ClickableIcon
        name="chevron-up"
        className={classNames({ selected: myVote > 0 })}
        onClick={() => (myVote <= 0 ? onVote(1) : onVote(0))}
      />
      <div className="score">
        {isVoting ? <span className="round-spinner"/> : score}
      </div>
      <ClickableIcon
        name="chevron-down"
        className={classNames({ selected: myVote < 0 })}
        onClick={() => (myVote >= 0 ? onVote(-1) : onVote(0))}
      />
    </div>
  </figure>
)

export default Vote
