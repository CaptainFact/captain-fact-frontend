import PropTypes from 'prop-types'
import React from 'react'
import Popup from 'reactjs-popup'

import { cn } from '../../lib/css-utils'

const FacetButton = ({
  label = undefined,
  activated = true,
  onClick,
  activatedIcon,
  deactivatedIcon = undefined,
  size = 40,
  keepTooltipInside = undefined,
  className = undefined,
  isSecondary,
}) => {
  const popupContent = (
    <button
      onClick={onClick}
      className={cn(
        'border-0 bg-0 p-0 outline-none inline-flex text-center cursor-pointer transition-transform duration-300 [&_svg]:h-full [&_svg]:w-full [&_svg]:[vertical-align:super]',
        className,
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotateY(${activated ? 180 : 0}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <span
        className={cn(
          'absolute p-[25%] border border-solid rounded-full transition-[opacity,color] duration-300 [backface-visibility:hidden] overflow-visible w-full h-full',
          isSecondary ? 'text-[#2D6282]' : 'text-[#4a4a4a]',
          'hover:text-primary',
        )}
        style={{
          transform: 'rotateY(180deg)',
        }}
      >
        {activatedIcon}
      </span>
      <span
        className={cn(
          'absolute p-[25%] border border-solid rounded-full transition-[opacity,color] duration-300 [backface-visibility:hidden] overflow-visible w-full h-full text-[#9b9b9b] hover:text-[#252525]',
        )}
        style={{
          opacity: activated ? 0 : 0.7,
        }}
      >
        {deactivatedIcon || activatedIcon}
      </span>
    </button>
  )

  return label ? (
    <Popup
      trigger={popupContent}
      position={['bottom center', 'bottom left', 'bottom right']}
      offsetY={4}
      on={['hover', 'focus']}
      keepTooltipInside={keepTooltipInside}
      contentStyle={{
        maxWidth: '200px',
        padding: '3px 8px',
        fontSize: '14px',
        fontWeight: 700,
        color: '#ffffff',
        background: 'rgba(54, 54, 54, 0.8)',
        boxShadow: 'none',
        animation: 'fadeIn 0.1s',
      }}
      arrowStyle={{
        color: 'rgba(54, 54, 54, 0.8)',
      }}
    >
      {label}
    </Popup>
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

export default FacetButton
