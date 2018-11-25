import capitalize from 'voca/capitalize'

export const checkLength = (value, range) => {
  return (
    value &&
    value.length >= range[0] &&
    (range[1] === -1 || value.length <= range[1])
  )
}

// TODO Migrate to validateLengthI18n
export const validateLength = (
  errors,
  fieldName,
  value,
  range,
  label = null
) => {
  if (checkLength(value, range)) return true
  const fieldLabel = label || capitalize(fieldName.replace('_', ' '))
  if (!value || value.length < range[0])
    errors[fieldName] = `${fieldLabel} must be at least ${range[0]} characters`
  else if (range[1] !== -1 && value.length > range[1])
    errors[fieldName] = `${fieldLabel} must be at most ${range[1]} characters`
  return false
}

export const validateLengthI18n = (t, errors, fieldName, value, range) => {
  if (checkLength(value, range)) return true
  if (!value || value.length < range[0])
    errors[fieldName] = t('main:misc.fieldMinLength', { min: range[0] })
  else if (range[1] !== -1 && value.length > range[1])
    errors[fieldName] = t('main:misc.fieldMaxLength', { max: range[1] })
  return false
}

export const validateFieldLength = (t, value, range) => {
  if (checkLength(value, range)) return undefined
  if (!value || value.length < range[0])
    return t('main:misc.fieldMinLength', { min: range[0] })
  if (range[1] !== -1 && value.length > range[1])
    return t('main:misc.fieldMaxLength', { max: range[1] })
  return undefined
}
