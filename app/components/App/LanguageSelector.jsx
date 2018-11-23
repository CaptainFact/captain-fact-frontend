import React from 'react'
import { Map } from 'immutable'
import classNames from 'classnames'
import { withNamespaces } from 'react-i18next'

const defaultLocales = new Map({
  en: 'English',
  fr: 'Français'
})

@withNamespaces() // Force waiting for translations to be loaded
export default class LanguageSelector extends React.PureComponent {
  render() {
    return (
      <div className="select-button">
        {this.renderSelect()}
      </div>
    )
  }

  renderSelect() {
    const options = defaultLocales
      .merge(this.props.additionalOptions || {})
      .sortBy((v, k) => k)

    return (
      <select
        className="upper"
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
}
