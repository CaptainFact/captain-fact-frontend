import React from 'react'
import { withNamespaces } from 'react-i18next'
import { Field } from 'redux-form'

const VALID_REASONS = ['1', '2']

const FlagReason = ({ value, label }) => (
  <label className="radio">
    <Field name="reason" component="input" type="radio" value={value} /> {label}
  </label>
)

const FlagReasonSelect = ({ t }) => {
  const labels = t('reason', { returnObjects: true })
  return (
    <div className="flag-reason-select field">
      <p className="control">
        {VALID_REASONS.map((key) => (
          <FlagReason key={key} value={key} label={labels[key]} />
        ))}
      </p>
    </div>
  )
}

export default withNamespaces('moderation')(FlagReasonSelect)
