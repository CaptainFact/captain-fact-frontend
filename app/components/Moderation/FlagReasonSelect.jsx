import React from 'react'
import { withTranslation } from 'react-i18next'
import { Field } from 'redux-form'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const VALID_REASONS = ['1', '2']

const FlagReasonSelect = ({ t }) => {
  const labels = t('reason', { returnObjects: true })

  return (
    <div className="flag-reason-select field">
      <Field
        name="reason"
        component={({ input }) => (
          <RadioGroup onValueChange={input.onChange} value={input.value}>
            {VALID_REASONS.map((key) => (
              <div key={key} className="flex items-center space-x-3">
                <RadioGroupItem value={key} id={`reason-${key}`} />
                <Label htmlFor={`reason-${key}`} className="text-lg">
                  {labels[key]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  )
}

export default withTranslation('moderation')(FlagReasonSelect)
