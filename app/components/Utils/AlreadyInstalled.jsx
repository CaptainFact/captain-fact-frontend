import React from 'react'
import { translate } from 'react-i18next'
import { checkExtensionInstall } from '../Utils'

@translate('error')
export default class AlreadyInstalled extends React.PureComponent {
  state = {isInstalled: false}

  componentDidMount() {
    checkExtensionInstall().then((installed) => {
      this.setState({isInstalled: installed})
    })
  }

  render() {
    const { isInstalled } = this.state
    return (
      <div className="content has-text-centered">
        <strong>{isInstalled ? this.props.t('errors:extension.alreadyInstalled') : ' '}</strong>
      </div>
    )
  }
}
