import React from 'react'
import PropTypes from 'prop-types'
import Toggle from 'react-toggled'
import styled, { css, keyframes } from 'styled-components'
import { space, color, themeGet } from 'styled-system'
import { Flex, Box } from '@rebass/grid'
import { transparentize } from 'polished'

const getBgColor = props => themeGet(`colors.${props.bg}`, props.bg)(props)

const focusAnimation = color => keyframes`
  0% {
    box-shadow: 0 0 0 0.25em ${transparentize(0.5, color)};
  }

  60% {
    box-shadow: 0 0 0 0.25em ${transparentize(0.5, color)};
  }

  100% {
    box-shadow: -0.075em 0.025em 0.25em rgba(0, 0, 0, 0.3);
  }
`

const Container = styled.button`
  width: 2em;
  height: 0.8em;
  border-radius: 1em;
  cursor: pointer;
  position: relative;
  transition: background 0.3s, box-shadow 0.3s;
  box-shadow: 0px 0px 0.25em rgba(75, 75, 75, 0.38) inset;
  font: inherit;
  line-height: normal;
  -webkit-appearance: none;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  &:focus > * {
    animation: ${props => focusAnimation(getBgColor(props))} 0.75s ease-out;
  }

  ${color}
  ${space}

  ${props => props.active
    && css`
      background: ${transparentize(0.5, getBgColor(props))};
    `}
`

Container.defaultProps = {
  type: 'button'
}

const ToggleBtn = styled(Box)`
  height: 1em;
  width: 1em;
  margin-top: -0.5em;
  border-radius: 1.5em;
  position: absolute;
  left: 0;
  transition: left 0.2s;
  box-shadow: -0.075em 0.025em 0.25em rgba(0, 0, 0, 0.3);

  ${props => props.active
    && css`
      left: 50%;
    `}
`

const LabelSpan = styled.span`
  cursor: pointer;
`

const StyledToggle = ({ name, label, color, size, checked, onChange, ...props }) => (
  <Toggle on={checked}>
    {({ on, toggle, getTogglerProps }) => (
      <Flex as="label" alignItems="center" fontSize={size} {...props}>
        <Container
          {...getTogglerProps()}
          active={on}
          bg={on ? color : 'black.300'}
          mr="0.5em"
          onClick={() => {
            toggle()
            onChange({ target: { name, type: 'checkbox', checked: !on } })
          }}
        >
          <ToggleBtn bg={on ? color : 'white'} active={on} />
        </Container>
        {label && <LabelSpan>{label}</LabelSpan>}
      </Flex>
    )}
  </Toggle>
)

StyledToggle.propTypes = {
  /** Color used when toggle is active */
  color: PropTypes.string,
  /** Label for the input */
  label: PropTypes.string,
  /** Size of the component */
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
    PropTypes.object
  ]),
  /** Wether the control should be checked. Set the input as controlled */
  checked: PropTypes.bool,
  /** Function called when state changes */
  onChange: PropTypes.func
}

StyledToggle.defaultProps = {
  color: 'primary',
  size: '1em'
}

export default StyledToggle
