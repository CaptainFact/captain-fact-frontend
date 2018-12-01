import React from 'react'
import PropTypes from 'prop-types'
import { optionsToQueryString } from '../../lib/url_utils'

const OpenCollectiveContributors = ({
  tier,
  avatarHeight = 72,
  showBtn = true,
  width = 325
}) => {
  const queryParams = optionsToQueryString({
    avatarHeight,
    showBtn,
    width
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
  tier: PropTypes.oneOf(['soutien-régulier', 'donateur']).isRequired,
  avatarHeight: PropTypes.number,
  width: PropTypes.number,
  showBtn: PropTypes.bool
}

export default OpenCollectiveContributors
