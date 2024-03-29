import PropTypes from 'prop-types'
import React from 'react'
import Popup from 'reactjs-popup'
import styled from 'styled-components'
import { themeGet } from 'styled-system'

import { fadeIn } from '../StyledUtils/Keyframes'

const StyledPopup = styled(Popup)`
  &-content {
    max-width: 200px;
    padding: 3px 8px;
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    background: rgba(54, 54, 54, 0.8);
    box-shadow: none;
    animation: ${fadeIn} 0.1s;

    .popup-arrow {
      color: rgba(54, 54, 54, 0.8);
    }
  }
`

const Wrapper = styled.button`
  border: 0;
  background: 0;
  padding: 0;
  outline: none;
  display: inline-flex;
  text-align: center;
  cursor: pointer;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  transform: rotateY(${({ activated }) => (activated ? 180 : 0)}deg);
  transform-style: preserve-3d;
  transition: transform 0.3s;

  > svg {
    position: absolute;
    border: 1px solid;
    border-radius: 50%;
    transition:
      opacity 0.3s,
      color 0.1s;
    backface-visibility: hidden;
    overflow: visible;
    padding: ${({ size }) => `${size / 4}px`};
    width: 100%;
    height: 100%;

    /* Activated icon */
    &:nth-child(1) {
      color: ${(props) =>
        props.$isSecondary ? props.theme.colors.secondary : props.theme.colors.black[400]};
      transform: rotateY(180deg);

      &:hover {
        color: ${themeGet('colors.primary')};
      }
    }

    /* Deactivated icon */
    &:nth-child(2) {
      color: #9b9b9b;
      opacity: ${({ activated }) => (activated ? 0 : 0.7)};

      &:hover {
        color: ${themeGet('colors.black.500')};
      }
    }
  }
`

const FacetButton = ({
  label,
  activated,
  onClick,
  activatedIcon,
  deactivatedIcon,
  size,
  keepTooltipInside,
  className,
  isSecondary,
}) => {
  const popupContent = (
    <Wrapper
      activated={activated}
      onClick={onClick}
      size={size}
      $isSecondary={isSecondary}
      className={className}
    >
      {activatedIcon}
      {deactivatedIcon || activatedIcon}
    </Wrapper>
  )

  return label ? (
    <StyledPopup
      trigger={popupContent}
      position={['bottom center', 'bottom left', 'bottom right']}
      offsetY={4}
      on={['hover', 'focus']}
      keepTooltipInside={keepTooltipInside}
    >
      {label}
    </StyledPopup>
  ) : (
    popupContent
  )
}

FacetButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  activated: PropTypes.bool,
  label: PropTypes.node,
  /** StyledIcon node */
  activatedIcon: PropTypes.node.isRequired,
  /** StyledIcon node */
  deactivatedIcon: PropTypes.node,
  size: PropTypes.number,
  keepTooltipInside: PropTypes.string,
  className: PropTypes.string,
}

FacetButton.defaultProps = {
  label: undefined,
  activated: true,
  deactivatedIcon: undefined,
  size: 40,
  keepTooltipInside: undefined,
  className: undefined,
}

export default FacetButton
