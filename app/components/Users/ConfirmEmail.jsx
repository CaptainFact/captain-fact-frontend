import React from 'react'
import { withRouter } from 'react-router'
import { withNamespaces } from 'react-i18next'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { confirmEmail } from '../../API/http_api/current_user'
import { ErrorView } from '../Utils/ErrorView'
import MessageView from '../Utils/MessageView'

@withRouter
@withNamespaces('user')
export default class ConfirmEmail extends React.PureComponent {
  state = { loading: true, error: null }

  componentDidMount() {
    confirmEmail(this.props.params.token).then(
      () => this.setState({ loading: false }),
      (e) => this.setState({ loading: false, error: e })
    )
  }

  render() {
    if (this.state.loading) {
      return <LoadingFrame />
    } else if (this.state.error) {
      return <ErrorView canGoBack={false} error={this.state.error} />
    } else {
      return <MessageView type="success">{this.props.t('user:emailConfirmed')}</MessageView>
    }
  }
}
