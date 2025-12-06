import PropTypes from 'prop-types'
import React from 'react'

const ProgressBar = ({ outerBackgroundColor, innerBackgroundColor, height, max, value }) => {
  const percentage = (value / max) * 100
  return (
    <div className="w-full">
      <div
        className="block border-none rounded-r-lg"
        style={{
          backgroundColor: outerBackgroundColor,
          height: height,
          width: '100%',
        }}
      >
        <div
          className="h-full rounded-r-lg transition-all"
          style={{
            backgroundColor: innerBackgroundColor,
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  )
}

ProgressBar.propTypes = {
  outerBackgroundColor: PropTypes.string,
  innerBackgroundColor: PropTypes.string,
  height: PropTypes.string,
  max: PropTypes.number,
  value: PropTypes.number.isRequired,
}

ProgressBar.defaultProps = {
  outerBackgroundColor: 'grey',
  innerBackgroundColor: 'blue',
  height: '1rem',
  max: 100,
}

export default ProgressBar
