import PropTypes from 'prop-types'
import React from 'react'

import { optionsToQueryString } from '../../lib/url_utils'

/**
 * Embed https://opencollective.com contributors.
 */
const OpenCollectiveContributors = ({
  tier,
  avatarHeight = 72,
  button = true,
  width = 325,
  limit = 50,
}) => {
  const queryParams = optionsToQueryString({
    avatarHeight,
    button,
    width,
    limit,
  })

  return (
    <object
      className="opencollective-contributors"
      aria-label="Support us on Open Collective"
      type="image/svg+xml"
      data={`https://opencollective.com/captainfact_io/tiers/${tier}.svg${queryParams}`}
    />
  )
}

OpenCollectiveContributors.propTypes = {
  tier: PropTypes.oneOf(['soutien-regulier', 'donateur', 'adhesion-membre']).isRequired,
  avatarHeight: PropTypes.number,
  width: PropTypes.number,
  button: PropTypes.bool,
}

export default OpenCollectiveContributors
