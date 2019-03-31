import capitalize from 'voca/capitalize'

export const checkLength = (value, range) => {
  return (
    value && value.length >= range[0] && (range[1] === -1 || value.length <= range[1])
  )
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
