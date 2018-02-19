import React from 'react'
import classNames from 'classnames'

import { Icon } from '../Utils'


const Vote = ({isVoting, score, myVote, onVote}) => (
  <figure>
    <div className="vote">
      <Icon name="chevron-up" isClickable={true}
            className={classNames({ selected: myVote > 0 })}
            onClick={() => myVote <= 0 ? onVote(1) : onVote(0)}/>
      <div className="score">
        {isVoting ? <span className="round-spinner"/> : score}
      </div>
      <Icon name="chevron-down" isClickable={true}
            className={classNames({ selected: myVote < 0 })}
            onClick={() => myVote >= 0 ? onVote(-1) : onVote(0)}/>
    </div>
  </figure>
)

export default Vote