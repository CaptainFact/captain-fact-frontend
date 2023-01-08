import React from 'react'
import { withNamespaces } from 'react-i18next'

import { ALL_VIDEOS, ONLY_COMMUNITY, ONLY_FEATURED, ONLY_PARTNERS } from '../../constants'

const VideoSourceFiltersSelect = ({ value, onChange, t }) => (
  <div className="select">
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value={ALL_VIDEOS}>{t('all')}</option>
      <option value={ONLY_FEATURED}>{t('featured')}</option>
      <option value={ONLY_PARTNERS}>{t('partners')}</option>
      <option value={ONLY_COMMUNITY}>{t('users')}</option>
    </select>
  </div>
)

export default withNamespaces('main')(VideoSourceFiltersSelect)
