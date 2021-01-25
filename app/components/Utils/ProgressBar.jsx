import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const ProgressBarContainer = styled.div`
  width: 100%;
  progress[value] {
    appearance: none;
    ::-webkit-progress-bar {
      background-color: ${(props) => props.outerBackgroundColor};
    }
    ::-webkit-progress-value {
      background-color: ${(props) => props.innerBackgroundColor};
    }
    ::-moz-progress-bar {
      background-color: ${(props) => props.innerBackgroundColor};
    }
  }
`

const StyledProgress = styled.progress`
  display: block;
  border: none;
  background-color: ${(props) => props.outerBackgroundColor};
  height: ${(props) => props.height};
  width: 100%;
`

const ProgressBar = ({ outerBackgroundColor, innerBackgroundColor, height, max, value }) => {
  return (
    <ProgressBarContainer
      outerBackgroundColor={outerBackgroundColor}
      innerBackgroundColor={innerBackgroundColor}
    >
      <StyledProgress
        outerBackgroundColor={outerBackgroundColor}
        height={height}
        value={value}
        max={max}
      />
    </ProgressBarContainer>
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
