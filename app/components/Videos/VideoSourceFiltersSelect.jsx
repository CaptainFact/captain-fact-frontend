import React from 'react'
import { withTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { ALL_VIDEOS, ONLY_COMMUNITY, ONLY_FEATURED, ONLY_PARTNERS } from '../../constants'

const VideoSourceFiltersSelect = ({ id, value, onChange, t }) => (
  <Select value={value} onValueChange={onChange} defaultValue={ALL_VIDEOS}>
    <SelectTrigger id={id} className="min-w-32">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={ALL_VIDEOS}>{t('all')}</SelectItem>
      <SelectItem value={ONLY_FEATURED}>{t('featured')}</SelectItem>
      <SelectItem value={ONLY_PARTNERS}>{t('partners')}</SelectItem>
      <SelectItem value={ONLY_COMMUNITY}>{t('users')}</SelectItem>
    </SelectContent>
  </Select>
)

export default withTranslation('main')(VideoSourceFiltersSelect)
