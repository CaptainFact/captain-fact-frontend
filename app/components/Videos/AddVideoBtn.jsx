import { CirclePlus } from 'lucide-react'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { MIN_REPUTATION_ADD_VIDEO } from '../../constants'
import { Button } from '../ui/button'
import ReputationGuardTooltip from '../Utils/ReputationGuardTooltip'

const AddVideoBtn = ({ t }) => {
  return (
    <ReputationGuardTooltip requiredRep={MIN_REPUTATION_ADD_VIDEO}>
      {({ hasReputation }) =>
        !hasReputation ? (
          <Button disabled={true} className="h-auto">
            <CirclePlus size={24} />
            <span>{t('videos.add')}</span>
          </Button>
        ) : (
          <Link to="/videos/add">
            <Button className="h-auto">
              <CirclePlus size={24} />
              <span>{t('videos.add')}</span>
            </Button>
          </Link>
        )
      }
    </ReputationGuardTooltip>
  )
}

export default withTranslation('main')(AddVideoBtn)
