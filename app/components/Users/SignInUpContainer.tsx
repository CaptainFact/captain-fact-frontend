import React from 'react'

import { Card } from '../ui/card'

export const SignInUpContainer = ({ children }) => {
  return (
    <div className="px-2" data-cy="sign-in-up-container">
      <Card className="max-w-md mx-auto my-24 md:my-48 p-6">{children}</Card>
    </div>
  )
}
