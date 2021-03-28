import React from 'react'
import Statement from '../Statements/Statement'
import Container from '../StyledUtils/Container'
import { Link } from 'react-router'
import { withNamespaces } from 'react-i18next'
import { statementURL } from '../../lib/cf_routes'

const StatementHit = ({ t, hit }) => {
  return (
    <Container background="white" borderRadius={8} m={2}>
      <Statement statement={hit} speaker={hit.speaker} withoutActions />
      {hit.video && (
        <Container p={2} textAlign="center">
          <Link to={statementURL(hit.video.hash_id, hit.id)}>{t('videos.see')}</Link>
        </Container>
      )}
    </Container>
  )
}

export default withNamespaces('main')(StatementHit)
