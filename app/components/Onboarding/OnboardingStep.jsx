import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import { addStep } from '../../state/onboarding/reducer'
import { isAuthenticated } from '../../state/users/current_user/selectors'


@connect(state => ({
  isAuthenticated: isAuthenticated(state),
  completedOnboarding: state.CurrentUser.completedOnboarding
}), {addStep})
@translate('onboarding')
export default class OnboardingStep extends React.PureComponent {
  state = {dispatched: false}

  componentDidMount() {
    this.createStep()
  }

  componentDidUpdate() {
    this.createStep()
  }

  createStep() {
    if (this.props.completedOnboarding ||
        this.state.dispatched ||
        !this.props.isAuthenticated) {
      return false
    }

    const {t, placement, target, titleI18n, contentI18n, uniqueId} = this.props

    this.props.addStep({
      uniqueId,
      target,
      placement,
      title: (t(titleI18n)),
      content: (t(contentI18n)),
    })
    this.setState({dispatched: true})
  }

  render() {
    return this.props.children
  }
}

OnboardingStep.propTypes = {
  uniqueId: PropTypes.number.isRequired,
  titleI18n: PropTypes.string.isRequired,
  contentI18n: PropTypes.string.isRequired,
  placement: PropTypes.string,
  children: PropTypes.node.isRequired
}
