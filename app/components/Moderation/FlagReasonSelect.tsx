import { FlagReason } from 'app/API/types/generated'
import { startCase } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const FlagReasonSelect = ({ onChange, value }) => {
  const { t } = useTranslation('moderation')
  const labels = t('reason', { returnObjects: true })

  return (
    <div className="flag-reason-select field">
      <RadioGroup name="reason" onValueChange={onChange} value={value}>
        {Object.values(FlagReason).map((key) => (
          <div key={key} className="flex items-center space-x-3">
            <RadioGroupItem value={key} id={`reason-${key}`} />
            <Label htmlFor={`reason-${key}`} className="text-lg dark:text-foreground">
              {labels[key] || startCase(key)}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FlagReasonSelect
