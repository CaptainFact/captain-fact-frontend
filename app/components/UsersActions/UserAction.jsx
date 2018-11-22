import React from "react"
import { withNamespaces } from "react-i18next"
import classNames from "classnames"

import UserAppellation from "../Users/UserAppellation"
import { TimeSince } from "../Utils/index"
import Tag from "../Utils/Tag"
import ActionDiff from "./ActionDiff"
import ActionIcon from "./ActionIcon"
import { Icon } from "../Utils/Icon"
import ActionEntityLink from "./ActionEntityLink"

const UserAction = ({ action, className, t, withoutUser }) => {
  const { user, type, time, targetUser } = action

  return (
    <div className={classNames(className, "user-action", "card")}>
      <div className="card-content action-description">
        <Tag type="info">
          <Icon name="clock-o" />
          &nbsp;
          <TimeSince time={time} />
        </Tag>
        <Tag className="action-type" type="info">
          <ActionIcon type={type} />
        </Tag>
        {!withoutUser && <UserAppellation user={user} />}
        <span className="action-name">
          <strong>{t("madeAction", { action: `$t(action.${type})` })}</strong>
        </span>
        <span className="entity-type">
          <ActionEntityLink action={action} />
        </span>
        {targetUser && (
          <span>
            de <UserAppellation user={targetUser} />
          </span>
        )}
      </div>
      <ActionDiff action={action} />
    </div>
  )
}

export default withNamespaces("history")(UserAction)
