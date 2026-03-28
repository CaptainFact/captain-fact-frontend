import { Statement } from 'app/API/types/generated'
import { STATEMENT_FOCUS_TIME } from 'app/constants'
import React, { createContext, useContext } from 'react'

const FocusedStatementContext = createContext({
  statement: null as Statement | null,
})

const getFocus = (statements, position: number) => {
  if (!position || !statements) {
    return null
  }

  const statement = statements.findLast((statement) => position >= statement.time)
  if (statement && position <= statement.time + STATEMENT_FOCUS_TIME) {
    return statement
  } else {
    return null
  }
}

export const FocusedStatementProvider = ({
  children,
  offset = 0,
  statements,
}: {
  offset: number
  statements: Statement[]
  children: ({ updatePosition }: { updatePosition: (position: number) => void }) => React.ReactNode
}) => {
  const [statement, setStatement] = React.useState<Statement | null>(null)

  const updatePosition = (position: number) => {
    const adjustedPosition = position - offset
    const newFocusedStatement = getFocus(statements, adjustedPosition)
    if (statement?.id !== newFocusedStatement?.id) {
      setStatement(newFocusedStatement)
    }
  }

  return (
    <FocusedStatementContext.Provider value={{ statement }}>
      {children({ updatePosition })}
    </FocusedStatementContext.Provider>
  )
}

export const useFocusedStatement = () => {
  const context = useContext(FocusedStatementContext)
  if (!context) {
    throw new Error('useFocusedStatement must be used within a FocusedStatementProvider')
  }
  return context
}
