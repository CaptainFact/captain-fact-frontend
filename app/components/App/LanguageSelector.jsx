import React from 'react'
import { Map } from 'immutable'
import classNames from 'classnames'
import { withNamespaces } from 'react-i18next'
import { Flex, Box } from '@rebass/grid'
import { Globe } from 'styled-icons/fa-solid/Globe'

const defaultLocales = new Map({
  en: 'English',
  fr: 'Français',
  ar: 'العربية'
})

@withNamespaces() // Force waiting for translations to be loaded
export default class LanguageSelector extends React.PureComponent {
  renderSelect() {
    const options = defaultLocales
      .merge(this.props.additionalOptions || {})
      .sortBy((v, k) => k)

    return (
      <select
        onChange={e => this.props.handleChange(e.target.value)}
        value={this.props.value}
      >
        {this.renderLocalesMap(options)}
      </select>
    )
  }

  renderLocalesMap(localesMap) {
    return localesMap.entrySeq().map(([key, value]) => (
      <option key={key} value={key}>
        {value}
      </option>
    ))
  }

  renderIcon() {
    const { value, size } = this.props
    if (value === 'fr') {
      return '🇫🇷'
    } else if (value === 'en') {
      return '🇬🇧'
    } else if (value === 'ar') {
      return '🇩🇿'
    }
    return <Globe size={!size ? '2em' : '1em'} />
  }

  render() {
    const sizeClass = this.props.size ? `is-${this.props.size}` : null
    return (
      <Flex
        className={classNames('language-selector', this.props.className)}
        alignItems="center"
      >
        {this.props.withIcon && <Box mx="0.5em">{this.renderIcon()}</Box>}
        <span className={classNames('select', sizeClass)}>{this.renderSelect()}</span>
      </Flex>
    )
  }
}
