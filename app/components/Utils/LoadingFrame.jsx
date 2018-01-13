import React from "react"
import { translate } from 'react-i18next'
import capitalize from 'voca/capitalize'


const LOADING_FADEOUT_TIME = 300 // 0.5s


@translate('main') // We don't wait for component to be ready
export class LoadingFrame extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {isDisabled: false}
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldProps.isLoading && !this.props.isLoading)
      setTimeout(() => this.setState({isDisabled: true}), LOADING_FADEOUT_TIME)
  }

  defaultTitle() {
    // If translation is not available, we'll show "Loading..."
    return capitalize(this.props.t('actions.loading').replace('actions.', ''))
  }

  render() {
    const {title, isLoading=true, size="large"} = this.props
    var classes = `loading-frame is-${size}`
    classes += isLoading ? ' is-loading' : ''
    classes += this.state.isDisabled ? ' not-displayed' : ''

    return (
      <div className={classes}>
        <div className="spinner"/>
        <h2 className="title">{title || this.defaultTitle()}...</h2>
      </div>
    )
  }
}

