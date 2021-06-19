import React from 'react'

import StatementCard from './StatementCard'
import styled from 'styled-components'

const StatementsList = styled.div`
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  justify-content: center;
  max-width: 1300px;
  padding: 1em 0;

  // the .columns css class set the margins to negative values, this
  // allow to override the style to force the value
  && {
    margin: 0 auto;
  }
`

export class StatementsGrid extends React.PureComponent {
  render() {
    return (
      <StatementsList className="columns is-multiline">
        {this.props.statements.map((statement) => {
          return <StatementCard key={statement.id} statement={statement} />
        })}
      </StatementsList>
    )
  }
}
