import React from "react"
import { withNamespaces } from "react-i18next"

import { USER_PICTURE_SMALL } from "../../constants"
import UserPicture from "../Users/UserPicture"
import UserAppellation from "../Users/UserAppellation"
import { TimeSince } from "../Utils/TimeSince"

const CommentHeader = ({ t, comment: { user, inserted_at }, withoutActions }) => (
  <div className="comment-header">
    {user ? (
      <span>
        <UserPicture user={user} size={USER_PICTURE_SMALL} />
        <UserAppellation user={user} withoutActions={withoutActions} />
      </span>
    ) : (
      <UserAppellation />
    )}
    <span> - </span>
    <TimeSince className="comment-time" time={inserted_at} />
  </div>
)

export default withNamespaces("main")(CommentHeader)
