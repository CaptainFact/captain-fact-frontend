import { Map } from 'immutable'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { Globe } from 'styled-icons/fa-solid'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/css-utils'

const defaultLocales = new Map({
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
  es: 'Español',
  eo: 'Esperanto',
  ru: 'Русский',
  pt_BR: 'Português (Brasil)',
})

@withTranslation() // Force waiting for translations to be loaded
export default class LanguageSelector extends React.PureComponent {
  renderSelect() {
    const options = defaultLocales.merge(this.props.additionalOptions || {}).sortBy((v, k) => k)

    return (
      <Select onValueChange={this.props.handleChange} value={this.props.value} id={this.props.id}>
        <SelectTrigger className="w-full md:min-w-32 min-w-12">
          <SelectValue />
        </SelectTrigger>
        <SelectContent data-cy="language-selector-options">
          {this.renderLocalesMap(options)}
        </SelectContent>
      </Select>
    )
  }

  renderLocalesMap(localesMap) {
    return localesMap.entrySeq().map(([key, value]) => (
      <SelectItem key={key} value={key}>
        {value}
      </SelectItem>
    ))
  }

  renderIcon() {
    const { value } = this.props
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
    return <Globe size={'2em'} />
  }

  render() {
    return (
      <div
        className={cn('flex items-center min-w-24', this.props.className)}
        data-cy="language-selector"
      >
        {this.props.withIcon && <div className="mr-2">{this.renderIcon()}</div>}
        {this.renderSelect()}
      </div>
    )
  }
}
