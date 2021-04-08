import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { themeGet } from 'styled-system'
import { Box } from '@rebass/grid'

import { BellSlash } from 'styled-icons/fa-solid'
import { Bell } from 'styled-icons/fa-solid'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const SubscribeIconContainer = styled(Box)`
  width: 1em;
  height: 1em;
  transform: rotateY(${(props) => (props.isSubscribed ? 180 : 0)}deg);
  transition: transform 0.3s;
  transform-style: preserve-3d;
  svg {
    position: absolute;
    width: 1em;
    height: 1em;
    border: 1px solid;
    border-radius: 1em;
    transition: opacity 0.3s, color 0.3s;
    backface-visibility: hidden;
  }

  ${(props) =>
    props.onClick &&
    css`
      cursor: pointer;
    `}
`

const IconSubscribed = styled(Bell)`
  color: ${themeGet('colors.yellow')};
  transform: rotateY(180deg);
  padding: 0.25em;
  &:hover {
    opacity: 0.7;
  }
`

const IconUnsubscribed = styled(BellSlash)`
  color: ${themeGet('colors.black.300')};
  opacity: 0.7;
  padding: 0.2em;
  &:hover {
    color: #e2b26f;
    opacity: 0.7;
  }
`

const updateSubscriptionQuery = gql`
  mutation UpdateSubscription($entityId: Int!, $scope: String!, $isSubscribed: Boolean!) {
    updateSubscription(entityId: $entityId, scope: $scope, isSubscribed: $isSubscribed) {
      id
      isSubscribed
      reason
    }
  }
`

const SubscribeBtn = ({
  size,
  isSubscribed,
  entityId,
  scope,
  deprecatedOverrideClick,
  ...props
}) => (
  <Mutation mutation={updateSubscriptionQuery} variables={{ entityId, scope }}>
    {(updateSubscription) => (
      <Box fontSize={size} {...props}>
        <SubscribeIconContainer
          isSubscribed={isSubscribed}
          onClick={() =>
            deprecatedOverrideClick
              ? deprecatedOverrideClick(!isSubscribed)
              : updateSubscription({
                  variables: { isSubscribed: !isSubscribed },
                })
          }
        >
          <IconSubscribed />
          <IconUnsubscribed />
        </SubscribeIconContainer>
      </Box>
    )}
  </Mutation>
)

SubscribeBtn.propTypes = {
  /** Entity ID */
  entityId: PropTypes.number.isRequired,
  /** Entity type */
  scope: PropTypes.oneOf(['comment', 'statement', 'video']),
  /** Current state (subscribed or unsubscribed) */
  isSubscribed: PropTypes.bool.isRequired,
  /** DEPRECATED: Override the graphql mutation */
  deprecatedOverrideClick: PropTypes.func,
  /** Icon size */
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Any props from `Box` */
  ...Box.propTypes,
}

SubscribeBtn.defaultProps = {
  size: '1em',
}

export default SubscribeBtn
