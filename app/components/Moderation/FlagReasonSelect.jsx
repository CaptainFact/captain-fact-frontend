import React from 'react'
import { useTranslation } from 'react-i18next'
import { Field } from 'formik'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const VALID_REASONS = ['1', '2']

const FlagReasonSelect = () => {
  const { t } = useTranslation('moderation')
  const labels = t('reason', { returnObjects: true })

  return (
    <div className="flag-reason-select field">
      <Field name="reason">
        {({ field, form }) => (
          <RadioGroup
            onValueChange={(value) => form.setFieldValue('reason', value)}
            value={field.value}
            onBlur={() => form.setFieldTouched('reason', true)}
          >
            {VALID_REASONS.map((key) => (
              <div key={key} className="flex items-center space-x-3">
                <RadioGroupItem value={key} id={`reason-${key}`} />
                <Label htmlFor={`reason-${key}`} className="text-lg dark:text-foreground">
                  {labels[key]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </Field>
    </div>
  )
}

export default FlagReasonSelect
