import PropTypes from 'prop-types'
import { Resizable } from 're-resizable'
import React, { useState } from 'react'
import styled from 'styled-components'
import { themeGet } from 'styled-system'

const StyledResizable = styled(Resizable)`
  /* Overwrite resizable column behaviour on small device */
  @media not all and (min-width: 1536px) {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 100% !important;
  }

  .right-resizable-handle {
    background: white;
    margin-right: 10px;
    @media (max-width: 1279px) {
      display: none;
    }

    border-left: 1px solid ${themeGet('colors.black.200')};
    border-right: 1px solid ${themeGet('colors.black.200')};

    &:after {
      content: '';
      position: absolute;
      top: calc(50% - 20px);
      left: 2px;
      height: 40px;
      width: 3px;
      border-left: 1px solid ${({ $resizing }) => themeGet(`colors.black.${$resizing ? 300 : 200}`)};
      border-right: 1px solid
        ${({ $resizing }) => themeGet(`colors.black.${$resizing ? 300 : 200}`)};
      transition: border-color 0.1s ease-out;
    }

    &:hover {
      &:after {
        border-left-color: ${themeGet('colors.black.300')};
        border-right-color: ${themeGet('colors.black.300')};
      }
    }
  }
`

const ResizableColumn = ({ children, className }) => {
  const [resizing, setResizing] = useState(false)

  return (
    <StyledResizable
      className={className}
      $resizing={resizing}
      onResizeStart={() => {
        setResizing(true)
      }}
      onResizeStop={() => {
        setResizing(false)
      }}
      defaultSize={{ width: '40%' }}
      maxWidth="60%"
      minWidth="400px"
      enable={{
        top: false,
        topRight: false,
        right: true,
        bottomRight: false,
        bottom: false,
        bottomLeft: false,
        left: false,
        topLeft: false,
      }}
      handleStyles={{
        right: {
          width: '9px',
          right: '-15px',
        },
      }}
      handleClasses={{
        right: 'right-resizable-handle',
      }}
    >
      {children}
    </StyledResizable>
  )
}

ResizableColumn.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ResizableColumn
