import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { get } from 'lodash'
import { Flex, Box } from '@rebass/grid'
import { Link } from 'react-router'

import { Videos } from 'styled-icons/boxicons-solid'

import { translate } from 'react-i18next'
import { loggedInUserSubscriptionsQuery } from '../../API/graphql_queries'
import { videoURL } from '../../lib/cf_routes'
import { LoadingFrame } from '../Utils/LoadingFrame'
import SubscribeBtn from '../Notifications/SubscribeBtn'
import { ErrorView } from '../Utils/ErrorView'
import { StyledH2 } from '../StyledUtils/Title'
import Message from '../Utils/Message'

@translate('main')
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
            <Flex flexDirection="column" alignItems="center" px={3} py={4}>
              <StyledH2 textTransform="capitalize">
                {this.props.t('entities.video_plural')}
              </StyledH2>
              <Box>
                {subscriptions.length === 0 ? (
                  <Message>No subscriptions</Message>
                ) : (
                  subscriptions.map((subscription) => (
                    <Flex key={subscription.id} mb={3} alignItems="center">
                      <SubscribeBtn
                        size="1.75em"
                        mr={2}
                        scope={subscription.scope}
                        entityId={subscription.videoId}
                        isSubscribed={subscription.isSubscribed}
                      />
                      <Box mr={1}>{this.renderScopeIcon(subscription.scope)}</Box>
                      <Box>
                        <Link to={videoURL(subscription.video.hashId)}>
                          {subscription.video.title}
                        </Link>
                      </Box>
                    </Flex>
                  ))
                )}
              </Box>
            </Flex>
          )
        }}
      </Query>
    )
  }
}
