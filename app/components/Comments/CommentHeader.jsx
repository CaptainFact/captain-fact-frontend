import React from 'react'
import { withTranslation } from 'react-i18next'

import { USER_PICTURE_SMALL } from '../../constants'
import UserAppellation from '../Users/UserAppellation'
import UserPicture from '../Users/UserPicture'
import { TimeSince } from '../Utils/TimeSince'

const CommentHeader = ({ comment: { user, inserted_at }, withoutActions }) => (
  <div className="flex flex-wrap items-center gap-1 mb-1">
    {user ? (
      <div className="flex items-center gap-1">
        <UserPicture user={user} size={USER_PICTURE_SMALL} />
        <UserAppellation user={user} withoutActions={withoutActions} />
      </div>
    ) : (
      <UserAppellation />
    )}
    <span>-</span>
    <div className="inline text-xs text-neutral-500">
      <TimeSince time={inserted_at} />
    </div>
  </div>
)

export default withTranslation('main')(CommentHeader)
