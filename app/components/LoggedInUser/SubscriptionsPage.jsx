import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { get } from 'lodash'
import { Flex, Box } from '@rebass/grid'
import { Link } from 'react-router'

import { Videos } from 'styled-icons/boxicons-regular/Videos'

import { loggedInUserSubscriptionsQuery } from '../../API/graphql_queries'
import { videoURL } from '../../lib/cf_routes'
import { LoadingFrame } from '../Utils/LoadingFrame'
import SubscribeBtn from '../Notifications/SubscribeBtn'

export default class NotificationsPage extends Component {
  renderScopeIcon() {
    return <Videos size="1.5em" />
  }

  render() {
    return (
      <Query query={loggedInUserSubscriptionsQuery}>
        {({ data, loading, error }) => {
          if (loading) {
            return <LoadingFrame />
          }

          return (
            <Flex flexDirection="column" alignItems="center" px={3} py={4}>
              <Box>
                {get(data, 'loggedInUser.subscriptions', []).map(subscription => (
                  <Flex key={subscription.id} mb={3} alignItems="center">
                    <SubscribeBtn size="1.75em" mr={2} isSubscribed />
                    <Box mr={1}>{this.renderScopeIcon(subscription.scope)}</Box>
                    <Box>
                      <Link to={videoURL(subscription.video.hashId)}>
                        {subscription.video.title}
                      </Link>
                    </Box>
                  </Flex>
                ))}
              </Box>
            </Flex>
          )
        }}
      </Query>
    )
  }
}
