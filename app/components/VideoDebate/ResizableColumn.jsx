import PropTypes from 'prop-types'
import { Resizable } from 're-resizable'
import React, { useState } from 'react'

import { cn } from '../../lib/css-utils'

const ResizableColumn = ({ children, className }) => {
  const [resizing, setResizing] = useState(false)

  return (
    <Resizable
      className={cn(
        'max-xl:w-full max-xl:max-w-full max-xl:min-w-full',
        '[&_.right-resizable-handle]:bg-white [&_.right-resizable-handle]:mr-2.5 [&_.right-resizable-handle]:max-xl:hidden [&_.right-resizable-handle]:border-l [&_.right-resizable-handle]:border-r [&_.right-resizable-handle]:border-[#dadada] [&_.right-resizable-handle]:hover:[&:after]:border-l-[#c2c2c2] [&_.right-resizable-handle]:hover:[&:after]:border-r-[#c2c2c2]',
        '[&_.right-resizable-handle]:after:content-[""] [&_.right-resizable-handle]:after:absolute [&_.right-resizable-handle]:after:top-[calc(50%-20px)] [&_.right-resizable-handle]:after:left-0.5 [&_.right-resizable-handle]:after:h-10 [&_.right-resizable-handle]:after:w-[3px] [&_.right-resizable-handle]:after:border-l [&_.right-resizable-handle]:after:border-r [&_.right-resizable-handle]:after:border-[#dadada] [&_.right-resizable-handle]:after:transition-[border-color] [&_.right-resizable-handle]:after:duration-100 [&_.right-resizable-handle]:after:ease-out',
        resizing &&
          '[&_.right-resizable-handle]:after:border-l-[#c2c2c2] [&_.right-resizable-handle]:after:border-r-[#c2c2c2]',
        className,
      )}
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
    </Resizable>
  )
}

ResizableColumn.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ResizableColumn
