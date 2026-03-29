import { Globe } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/css-utils'

const defaultLocales: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
  es: 'Español',
  eo: 'Esperanto',
  ru: 'Русский',
  pt_BR: 'Português (Brasil)',
}

interface LanguageSelectorProps {
  value?: string
  handleChange?: (value: string) => void
  id?: string
  className?: string
  withIcon?: boolean
  additionalOptions?: Record<string, string>
}

const renderIcon = (value: string) => {
  if (value === 'fr') {
    return '🇫🇷'
  } else if (value === 'en') {
    return '🇬🇧'
  } else if (value === 'ar') {
    return '🇩🇿'
  } else if (value === 'pt_BR') {
    return '🇧🇷'
  } else if (value === 'es') {
    return '🇪🇸'
  } else if (value === 'eo') {
    return '🌍'
  } else if (value === 'ru') {
    return '🇷🇺'
  }
  return <Globe size={32} />
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  handleChange,
  id,
  className,
  withIcon,
  additionalOptions,
}) => {
  // Force waiting for translations to be loaded
  useTranslation()

  const options = React.useMemo(() => {
    const merged: Record<number, React.ReactNode> = {
      ...defaultLocales,
      ...(additionalOptions || {}),
    }
    // Sort by key
    return Object.keys(merged)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = !withIcon ? (
            merged[key]
          ) : (
            <>
              {renderIcon(key)}&nbsp;&nbsp;{merged[key]}
            </>
          )
          return acc
        },
        {} as Record<string, string>,
      )
  }, [additionalOptions, withIcon])

  return (
    <div className={cn('flex items-center min-w-24', className)} data-cy="language-selector">
      <Select onValueChange={handleChange} value={value}>
        <SelectTrigger className="w-full md:min-w-32 min-w-12" id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent data-cy="language-selector-options">
          {Object.entries(options).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default LanguageSelector
