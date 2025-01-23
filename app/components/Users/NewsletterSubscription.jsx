import { CheckCircle, CircleAlert } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'

import { HttpApi } from '../../API'
import { Alert, AlertDescription } from '../ui/alert'
import { LoadingFrame } from '../Utils/LoadingFrame'

@withTranslation('user')
export default class NewsletterSubscription extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { status: 'loading' }
  }

  componentDidMount() {
    // Send request
    HttpApi.get(`newsletter/unsubscribe/${this.props.match.params.token}`)
      .then(() => this.setState({ status: 'success' }))
      .catch(() => this.setState({ status: 'error' }))
  }

  render() {
    if (this.state.status === 'loading') {
      return <LoadingFrame />
    }

    const isSuccess = this.state.status === 'success'
    const alertVariant = isSuccess ? 'success' : 'destructive'
    return (
      <div className="container mx-auto my-24 p-6">
        <Alert variant={alertVariant} className="mb-4">
          <AlertDescription>
            {isSuccess ? (
              <CheckCircle size="1em" className="inline mr-2" />
            ) : (
              <CircleAlert size="1em" className="inline mr-2" />
            )}
            {this.props.t('newsletter.unsubscribe', {
              context: this.state.status,
            })}
          </AlertDescription>
        </Alert>
      </div>
    )
  }
}
