import React from 'react'

import { ErrorView } from '../Utils/ErrorView'

export const NotFound = () => (
  <div className="px-2 my-12 max-w-[500px] mx-auto">
    <ErrorView error="not_found" />
  </div>
)
