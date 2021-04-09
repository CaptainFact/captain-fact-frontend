import React from 'react'
import FacetButton from '../../Utils/FacetButton'

const Action = (props) => <FacetButton {...props} keepTooltipInside="#col-video" />

Action.propTypes = {
  ...FacetButton.propTypes,
}

Action.defaultProps = {
  ...FacetButton.defaultProps,
}

export default Action
