import React from 'react'
import PropTypes from 'prop-types'

import { BellSlash } from 'styled-icons/fa-solid'
import { Bell } from 'styled-icons/fa-solid'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Action from '../VideoDebate/Actions/Action'

const updateSubscriptionQuery = gql`
  mutation UpdateSubscription($entityId: Int!, $scope: String!, $isSubscribed: Boolean!) {
    updateSubscription(entityId: $entityId, scope: $scope, isSubscribed: $isSubscribed) {
      id
      isSubscribed
      reason
    }
  }
`

const SubscribeBtn = ({ isSubscribed, entityId, scope, ...props }) => (
  <Mutation mutation={updateSubscriptionQuery} variables={{ entityId, scope }}>
    {(updateSubscription) => (
      <Action
        activated={isSubscribed}
        onClick={() =>
          updateSubscription({
            variables: { isSubscribed: !isSubscribed },
          })
        }
        activatedIcon={<Bell />}
        deactivatedIcon={<BellSlash />}
        {...props}
      />
    )}
  </Mutation>
)

SubscribeBtn.propTypes = {
  /** Entity ID */
  entityId: PropTypes.number.isRequired,
  /** Entity type */
  scope: PropTypes.oneOf(['comment', 'statement', 'video']).isRequired,
  /** Current state (subscribed or unsubscribed) */
  isSubscribed: PropTypes.bool.isRequired,
}

export default SubscribeBtn
