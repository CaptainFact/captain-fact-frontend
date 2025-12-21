import React from 'react'
import { withTranslation } from 'react-i18next'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const VALID_REASONS = ['1', '2']

const FlagReasonSelect = ({ t, onChange, value }) => {
  const labels = t('reason', { returnObjects: true })

  return (
    <div className="flag-reason-select field">
      <RadioGroup name="reason" onValueChange={onChange} value={value}>
        {VALID_REASONS.map((key) => (
          <div key={key} className="flex items-center space-x-3">
            <RadioGroupItem value={key} id={`reason-${key}`} />
            <Label htmlFor={`reason-${key}`} className="text-lg dark:text-foreground">
              {labels[key]}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default withTranslation('moderation')(FlagReasonSelect)
