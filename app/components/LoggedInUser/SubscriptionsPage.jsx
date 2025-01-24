import { Query } from '@apollo/client/react/components'
import { get } from 'lodash'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Videos } from 'styled-icons/boxicons-solid'

import { loggedInUserSubscriptionsQuery } from '../../API/graphql_queries'
import { videoURL } from '../../lib/cf_routes'
import SubscribeBtn from '../Notifications/SubscribeBtn'
import { StyledH2 } from '../StyledUtils/Title'
import { Card } from '../ui/card'
import { ErrorView } from '../Utils/ErrorView'
import { LoadingFrame } from '../Utils/LoadingFrame'

@withTranslation('main')
export default class NotificationsPage extends Component {
  renderScopeIcon() {
    return <Videos size="1.5em" />
  }

  render() {
    return (
      <Query
        query={loggedInUserSubscriptionsQuery}
        variables={{ scopes: ['video'] }}
        fetchPolicy="network-only"
      >
        {({ data, loading, error }) => {
          if (loading) {
            return <LoadingFrame />
          } else if (error) {
            return <ErrorView error={error} />
          }

          const subscriptions = get(data, 'loggedInUser.subscriptions', [])
          return (
            <div className="flex flex-col items-center px-3 py-4">
              <StyledH2 textTransform="capitalize">{this.props.t('entities.video_other')}</StyledH2>
              <div>
                {subscriptions.length === 0 ? (
                  <Card className="p-6">No subscriptions</Card>
                ) : (
                  subscriptions.map((subscription) => (
                    <div key={subscription.id} className="flex mb-3 items-center">
                      <div className="flex mr-2">
                        <SubscribeBtn
                          size={24}
                          scope={subscription.scope}
                          entityId={subscription.videoId}
                          isSubscribed={subscription.isSubscribed}
                        />
                      </div>
                      <div className="mr-1">{this.renderScopeIcon(subscription.scope)}</div>
                      <div>
                        <Link className="hover:underline" to={videoURL(subscription.video.hashId)}>
                          {subscription.video.title}
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        }}
      </Query>
    )
  }
}
