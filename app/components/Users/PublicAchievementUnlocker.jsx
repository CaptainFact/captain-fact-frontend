import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import isPromise from 'is-promise'

import { isAuthenticated } from '../../state/users/current_user/selectors'
import { unlockPublicAchievement } from '../../state/users/current_user/effects'
import { flashSuccessMsg } from '../../state/flashes/reducer'


/**
 * Check if user has given achievement. If not, calls `meetConditions` and trigger effect if the result is true.
 * If no meetConditions is passed, component will just unlock achievement on mount / update.
 */
@connect(
  state => ({
    isAuthenticated: isAuthenticated(state),
    achievements: state.CurrentUser.data.achievements,
    user: state.CurrentUser.data
  }),
  {unlockPublicAchievement, flashSuccessMsg}
)
@translate('achievements')
class PublicAchievementUnlocker extends React.PureComponent {
  componentDidMount() {
    this.unlockIfNecessary()
  }

  componentDidUpdate(oldProps) {
    if (this.props.achievements !== oldProps.achievements)
      this.unlockIfNecessary()
  }

  render() {
    return null
  }

  unlockIfNecessary = () => {
    if (!this.props.isAuthenticated || this.hasAchievement())
      return false

    if (!this.props.meetConditionsFunc)
      this.doUnlockAchievement()
    else {
      const funcResult = this.props.meetConditionsFunc()
      if (funcResult === true)
        this.doUnlockAchievement()
      else if (isPromise(funcResult))
        funcResult.then((result) => {
          if (result === true)
            this.doUnlockAchievement()
        })
    }
    return true
  }

  hasAchievement = () => this.props.achievements.includes(this.props.achievementId)

  doUnlockAchievement = () => {
    this.props.unlockPublicAchievement(this.props.achievementId).then(() => {
      const achievementTitle = this.props.t(`${this.props.achievementId}.title`)
      this.props.flashSuccessMsg('achievements:unlocked', {
        i18nParams: {achievement: achievementTitle},
        infoUrl: `/u/${this.props.user.username}`,
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
