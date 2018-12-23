import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import isPromise from 'is-promise'

import { flashSuccessMsg } from '../../state/flashes/reducer'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'
import { unlockPublicAchievement } from '../../API/http_api/current_user'

/**
 * Check if user has given achievement. If not, calls `meetConditions` and
 * trigger effect if the result is true.
 * If no meetConditions is passed, component will just unlock achievement on
 * mount / update.
 */
@connect(
  null,
  { flashSuccessMsg }
)
@withNamespaces('achievements')
@withLoggedInUser
class PublicAchievementUnlocker extends React.PureComponent {
  componentDidMount() {
    this.unlockIfNecessary()
  }

  componentDidUpdate(oldProps) {
    const { isAuthenticated, loggedInUser } = this.props
    if (
      isAuthenticated
      && loggedInUser.achievements !== oldProps.loggedInUser.achievements
    ) {
      this.unlockIfNecessary()
    }
  }

  render() {
    return null
  }

  unlockIfNecessary = () => {
    if (!this.props.isAuthenticated || this.hasAchievement()) {
      return false
    }

    if (!this.props.meetConditionsFunc) {
      this.doUnlockAchievement()
    } else {
      const funcResult = this.props.meetConditionsFunc()
      if (funcResult === true) this.doUnlockAchievement()
      else if (isPromise(funcResult))
        funcResult.then(result => {
          if (result === true) this.doUnlockAchievement()
        })
    }
    return true
  }

  hasAchievement = () => {
    return this.props.loggedInUser.achievements.includes(this.props.achievementId)
  }

  doUnlockAchievement = () => {
    unlockPublicAchievement(this.props.achievementId).then(user => {
      this.props.updateLoggedInUser(user)
      const achievementTitle = this.props.t(`${this.props.achievementId}.title`)
      this.props.flashSuccessMsg('achievements:unlocked', {
        i18nParams: { achievement: achievementTitle },
        infoUrl: `/u/${this.props.loggedInUser.username}`,
        iconName: 'trophy'
      })
    })
  }
}

PublicAchievementUnlocker.propTypes = {
  achievementId: PropTypes.number.isRequired,
  /**
   * A function like () => bool or () => Promise (that should resolve with a bool)
   */
  meetConditionsFunc: PropTypes.func
}

export default PublicAchievementUnlocker
