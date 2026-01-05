import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { statementURL } from '../../lib/cf_routes'
import Statement from '../Statements/Statement'

const StatementHit = ({ t, hit }) => {
  return (
    <div className="bg-white rounded-lg m-2">
      <Statement
        withoutPlayback
        statement={{
          ...hit,
          video: {
            ...hit.video,
            facebookId: hit.video.facebook_id,
            youtubeId: hit.video.youtube_id,
            hashId: hit.video.hash_id,
          },
        }}
        speaker={
          !hit.speaker
            ? null
            : {
                ...hit.speaker,
                fullName: hit.speaker.full_name,
                wikidataItemId: hit.speaker.wikidata_item_id,
              }
        }
        withoutActions
      />
      {hit.video && (
        <div className="p-2 text-center">
          <Link to={statementURL(hit.video.hash_id, hit.id)}>{t('videos.see')}</Link>
        </div>
      )}
    </div>
  )
}

export default withTranslation('main')(StatementHit)
