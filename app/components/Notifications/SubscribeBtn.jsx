import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { UPDATE_SUBSCRIPTION_MUTATION } from 'app/API/graphql_queries'
import { Bell, BellOff } from 'lucide-react'
import PropTypes from 'prop-types'
import React from 'react'

import Action from '../VideoDebate/ActionButton'

const SubscribeBtn = ({ isSubscribed, entityId, scope, ...props }) => (
  <Mutation mutation={UPDATE_SUBSCRIPTION_MUTATION} variables={{ entityId, scope }}>
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
