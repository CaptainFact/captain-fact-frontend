import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { statementURL } from '../../lib/cf_routes'
import Statement from '../Statements/Statement'
import Container from '../StyledUtils/Container'

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

export default withTranslation('main')(StatementHit)
