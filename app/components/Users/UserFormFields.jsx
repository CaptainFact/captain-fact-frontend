import { AtSign, IdCard, Lock, Mail } from 'lucide-react'
import React from 'react'

import { cleanStr } from '../../lib/clean_str'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export const FormikUserEmailField = ({
  t,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  label = t('email'),
  placeholder = 'example@example.com',
  _required = true,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">{label}</Label>
      <div className="relative">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={placeholder}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`pl-10 ${touched.email && errors.email ? 'border-red-600' : ''}`}
          {...props}
        />
        <Mail
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
        />
      </div>
      {touched.email && errors.email && (
        <span className="text-xs text-red-600 pl-1">{errors.email}</span>
      )}
    </div>
  )
}

export const FormikUserEmailOrUsernameField = ({
  t,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  label = t('emailOrUsername'),
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">{label}</Label>
      <div className="relative">
        <Input
          id="email"
          name="email"
          type="text"
          placeholder="example@example.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`pl-10 ${touched.email && errors.email ? 'border-red-600' : ''}`}
          {...props}
        />
        <IdCard
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
        />
      </div>
      {touched.email && errors.email && (
        <span className="text-xs text-red-600 pl-1">{errors.email}</span>
      )}
    </div>
  )
}

export const FormikUserPasswordField = ({
  t,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  label,
  required = true,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="password">{label || t(required ? 'password' : 'passwordOptional')}</Label>
      <div className="relative">
        <Input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`pl-10 ${touched.password && errors.password ? 'border-red-600' : ''}`}
          {...props}
        />
        <Lock
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
        />
      </div>
      {touched.password && errors.password && (
        <span className="text-xs text-red-600 pl-1">{errors.password}</span>
      )}
    </div>
  )
}

export const FormikUserPasswordRepeatField = ({
  t,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  label = t('repeatPassword'),
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="passwordRepeat">{label}</Label>
      <div className="relative">
        <Input
          id="passwordRepeat"
          name="passwordRepeat"
          type="password"
          value={values.passwordRepeat}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`pl-10 ${touched.passwordRepeat && errors.passwordRepeat ? 'border-red-600' : ''}`}
          {...props}
        />
        <Lock
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
        />
      </div>
      {touched.passwordRepeat && errors.passwordRepeat && (
        <span className="text-xs text-red-600 pl-1">{errors.passwordRepeat}</span>
      )}
    </div>
  )
}

export const FormikUserUsernameField = ({
  t,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  label = t('username'),
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="username">{label}</Label>
      <div className="relative">
        <Input
          id="username"
          name="username"
          type="text"
          placeholder={label}
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`pl-10 ${touched.username && errors.username ? 'border-red-600' : ''}`}
          {...props}
        />
        <AtSign
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
        />
      </div>
      {touched.username && errors.username && (
        <span className="text-xs text-red-600 pl-1">{errors.username}</span>
      )}
    </div>
  )
}

export const FormikUserNameField = ({
  t,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  label = `${t('realName')} (${t('optional')})`,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">{label}</Label>
      <div className="relative">
        <Input
          id="name"
          name="name"
          type="text"
          placeholder={label}
          value={values.name}
          onChange={(e) => {
            handleChange({
              target: { name: 'name', value: cleanStr(e.target.value).trim() },
            })
          }}
          onBlur={handleBlur}
          className={`pl-10 ${touched.name && errors.name ? 'border-red-600' : ''}`}
          {...props}
        />
        <IdCard
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
        />
      </div>
      {touched.name && errors.name && (
        <span className="text-xs text-red-600 pl-1">{errors.name}</span>
      )}
    </div>
  )
}
