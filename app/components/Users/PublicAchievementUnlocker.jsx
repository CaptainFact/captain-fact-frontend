import isPromise from 'is-promise'
import { Link } from 'lucide-react'
import PropTypes from 'prop-types'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { toast } from '@/hooks/use-toast'

import { unlockPublicAchievement } from '../../API/http_api/current_user'
import { withLoggedInUser } from '../LoggedInUser/UserProvider'

/**
 * Check if user has given achievement. If not, calls `meetConditions` and
 * trigger effect if the result is true.
 * If no meetConditions is passed, component will just unlock achievement on
 * mount / update.
 */
@withTranslation('achievements')
@withLoggedInUser
class PublicAchievementUnlocker extends React.PureComponent {
  componentDidMount() {
    this.unlockIfNecessary()
  }

  componentDidUpdate(oldProps) {
    const { isAuthenticated, loggedInUser } = this.props
    if (isAuthenticated && loggedInUser.achievements !== oldProps.loggedInUser.achievements) {
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
      if (funcResult === true) {
        this.doUnlockAchievement()
      } else if (isPromise(funcResult)) {
        funcResult.then((result) => {
          if (result === true) {
            this.doUnlockAchievement()
          }
        })
      }
    }
    return true
  }

  hasAchievement = () => {
    return this.props.loggedInUser.achievements.includes(this.props.achievementId)
  }

  doUnlockAchievement = () => {
    unlockPublicAchievement(this.props.achievementId).then((user) => {
      this.props.updateLoggedInUser(user)
      const achievementTitle = this.props.t(`${this.props.achievementId}.title`)
      toast({
        variant: 'success',
        title: this.props.t('achievements:unlocked', { achievement: achievementTitle }),
        action: (
          <Link to={`/u/${this.props.loggedInUser.username}/profile`}>
            {this.props.t('main:actions.moreInfo')}
          </Link>
        ),
      })
    })
  }
}

PublicAchievementUnlocker.propTypes = {
  achievementId: PropTypes.number.isRequired,
  /**
   * A function like () => bool or () => Promise (that should resolve with a bool)
   */
  meetConditionsFunc: PropTypes.func,
}

export default PublicAchievementUnlocker
