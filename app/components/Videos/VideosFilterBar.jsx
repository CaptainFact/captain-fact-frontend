import { Map } from 'immutable'
import React from 'react'
import { withNamespaces } from 'react-i18next'

import LanguageSelector from '../App/LanguageSelector'
import FieldWithLabelAddon from '../FormUtils/FieldWithLabelAddon'
import VideoSourceFiltersSelect from './VideoSourceFiltersSelect'

const VideosFilterBar = ({ onLanguageChange, onSourceChange, source, language, t }) => {
  return (
    <nav className="level videos-filter">
      <FieldWithLabelAddon label={t('misc.source')} inputId="video-source-filter">
        <VideoSourceFiltersSelect
          value={source}
          onChange={onSourceChange}
          id="video-source-filter"
        />
      </FieldWithLabelAddon>
      <FieldWithLabelAddon label={t('misc.languageFilter')} inputId="video-language-filter">
        <LanguageSelector
          id="video-language-filter"
          additionalOptions={
            new Map({
              all: t('misc.all'),
              unknown: t('misc.unknown'),
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
