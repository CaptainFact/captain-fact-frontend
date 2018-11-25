import React from 'react'
import { Map } from 'immutable'
import { withNamespaces } from 'react-i18next'
import FieldWithLabelAddon from '../FormUtils/FieldWithLabelAddon'
import FilterOnlyFromPartners from './FilterOnlyFromPartners'
import LanguageSelector from '../App/LanguageSelector'

const VideosFilterBar = ({
  onLanguageChange,
  onSourceChange,
  source,
  language,
  t
}) => {
  return (
    <nav className="level videos-filter">
      <FieldWithLabelAddon label={t('misc.source')}>
        <FilterOnlyFromPartners value={source} onChange={onSourceChange} />
      </FieldWithLabelAddon>
      <FieldWithLabelAddon label={t('misc.languageFilter')}>
        <LanguageSelector
          additionalOptions={
            new Map({
              all: t('misc.all'),
              unknown: t('misc.unknown')
            })
          }
          handleChange={onLanguageChange}
          value={language || 'all'}
        />
      </FieldWithLabelAddon>
    </nav>
  )
}

export default withNamespaces('main')(VideosFilterBar)
