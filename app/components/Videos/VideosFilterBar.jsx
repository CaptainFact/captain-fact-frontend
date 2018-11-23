import React, {Fragment} from 'react'
import { Map } from 'immutable'
import { withNamespaces } from 'react-i18next'
import FieldWithLabelAddon from '../FormUtils/FieldWithLabelAddon'
import FilterOnlyFromPartners from './FilterOnlyFromPartners'
import LanguageSelector from '../App/LanguageSelector'
import {Icon} from "../Utils"
import capitalize from "voca/capitalize"
import AddVideoBtn from "./AddVideoBtn"

const VideosFilterBar = ({
  onLanguageChange,
  onSourceChange,
  source,
  language,
  t
}) => {
  return (
    <div className="video-filter-container">
      <div className="video-filter-fixed-bloc">
        <div className="video-filter-fixed-content">
          <section className="header">
            <h2 className="title is-2">
              <Icon name="television" />
              <span> {capitalize(t('entities.video_plural'))}</span>
            </h2>
            <AddVideoBtn />
          </section>

          <nav className="level videos-filter">
            <FieldWithLabelAddon label={t('misc.source')}>
              <FilterOnlyFromPartners
                value={source}
                onChange={onSourceChange}
              />
            </FieldWithLabelAddon>
            <FieldWithLabelAddon label={t('misc.languageFilter')}>
              <LanguageSelector
                additionalOptions={new Map({
                  all: t('misc.all'),
                  unknown: t('misc.unknown')
                })}
                handleChange={onLanguageChange}
                value={language || 'all'}
              />
            </FieldWithLabelAddon>
          </nav>

        </div>
      </div>
    </div>
  )
}

export default withNamespaces('main')(VideosFilterBar)
