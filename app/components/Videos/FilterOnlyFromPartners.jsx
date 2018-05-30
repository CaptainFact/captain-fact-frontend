import React from 'react'
import { translate } from 'react-i18next'


const PARTNERS_KEY = 'partners'
const USERS_KEY = 'users'

const FilterOnlyFromPartners = ({value, onChange, t}) => (
  <div className="select">
    <select
      value={value ? PARTNERS_KEY : USERS_KEY}
      onChange={e => onChange(e.target.value === PARTNERS_KEY)}
    >
      <option value={PARTNERS_KEY}>{t(PARTNERS_KEY)}</option>
      <option value={USERS_KEY}>{t(USERS_KEY)}</option>
    </select>
  </div>
)

export default translate('main')(FilterOnlyFromPartners)
