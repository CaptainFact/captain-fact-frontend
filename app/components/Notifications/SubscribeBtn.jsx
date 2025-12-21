import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { Bell, BellOff } from 'lucide-react'
import PropTypes from 'prop-types'
import React from 'react'

import Action from '../VideoDebate/ActionButton'

const updateSubscriptionQuery = gql`
  mutation UpdateSubscription($entityId: ID!, $scope: String!, $isSubscribed: Boolean!) {
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
        activatedIcon={<Bell className="w-full h-full" />}
        deactivatedIcon={<BellOff className="w-full h-full" />}
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
