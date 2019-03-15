import React from 'react'
import { withNamespaces } from 'react-i18next'

import Alert from '../Utils/Alert'
import { HttpApi } from '../../API'
import { LoadingFrame } from '../Utils/LoadingFrame'

@withNamespaces('user')
export default class NewsletterSubscription extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { status: 'loading' }
  }

  componentDidMount() {
    // Send request
    HttpApi.get(`newsletter/unsubscribe/${this.props.params.token}`)
      .then(() => this.setState({ status: 'success' }))
      .catch(() => this.setState({ status: 'error' }))
  }

  render() {
    if (this.state.status === 'loading') return <LoadingFrame />
    const cssType = this.state.status === 'success' ? this.state.status : 'danger'
    return (
      <div className="section">
        <Alert type={cssType} style={{ maxWidth: 400, margin: '3em auto' }}>
          {this.props.t('newsletter.unsubscribe', {
            context: this.state.status
          })}
        </Alert>
      </div>
    )
  }
}
