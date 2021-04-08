import React from 'react'
import FacetButton from '../../Utils/FacetButton'

const Action = (props) => <FacetButton keepTooltipInside="#col-video" {...props} />

Action.propTypes = {
  ...FacetButton.propTypes,
}

Action.defaultProps = {
  ...FacetButton.defaultProps,
}

export default Action
