import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { statementURL } from '../../lib/cf_routes'
import Statement from '../Statements/Statement'

const StatementHit = ({ t, hit }) => {
  return (
    <div className="bg-white rounded-lg m-2">
      <Statement statement={hit} speaker={hit.speaker} withoutActions />
      {hit.video && (
        <div className="p-2 text-center">
          <Link to={statementURL(hit.video.hash_id, hit.id)}>{t('videos.see')}</Link>
        </div>
      )}
    </div>
  )
}

export default withTranslation('main')(StatementHit)
