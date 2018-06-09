import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { unlinkProvider } from '../../state/users/current_user/effects'

@connect(null, {unlinkProvider})
@translate('user')
export default class ThirdPartyAccountLinker extends React.PureComponent {
  render() {
    return (
      <div className="field has-addons" style={{width: 200, margin: 'auto'}}>
        <div className="control">
          <div className="linked-account-title">
            {this.props.title}
          </div>
        </div>
        <div className="control">
          {this.renderButton()}
        </div>
      </div>
    )
  }

  renderButton() {
    if (!this.props.isLinked)
      return (
        <a type="submit" className="button" href={this.props.authUrl}>
          {this.props.t('linkAccount')}
        </a>
      )
    return (
      <button
        type="submit"
        className="button is-danger"
        onClick={() => this.props.unlinkProvider(this.props.provider)}
      >
        {this.props.t('unlinkAccount')}
      </button>
    )
  }

  renderUnlinkAccount() {
    return (
      <button
        type="submit"
        className="button is-danger"
        onClick={() => this.props.unlinkProvider(this.props.provider)}
      >
        {this.props.t('unlinkAccount')}
      </button>
    )
  }
}