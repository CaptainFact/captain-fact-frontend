import { Query } from '@apollo/client/react/components'
import { Box, Flex } from '@rebass/grid'
import { get } from 'lodash'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Videos } from 'styled-icons/boxicons-solid'

import { loggedInUserSubscriptionsQuery } from '../../API/graphql_queries'
import { videoURL } from '../../lib/cf_routes'
import SubscribeBtn from '../Notifications/SubscribeBtn'
import { StyledH2 } from '../StyledUtils/Title'
import { ErrorView } from '../Utils/ErrorView'
import { LoadingFrame } from '../Utils/LoadingFrame'
import Message from '../Utils/Message'

const SubscribeBtnBox = styled(Box)`
  display: flex;
`
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
                      <SubscribeBtnBox mr={2}>
                        <SubscribeBtn
                          size={24}
                          scope={subscription.scope}
                          entityId={subscription.videoId}
                          isSubscribed={subscription.isSubscribed}
                        />
                      </SubscribeBtnBox>
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
