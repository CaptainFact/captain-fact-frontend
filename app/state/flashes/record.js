import { Record } from 'immutable'
import { v4 as uuidv4 } from 'uuid'

import { DEFAULT_FLASH_DURATION } from '../../constants'

const Flash = Record({
  id: 0,
  timeLeft: DEFAULT_FLASH_DURATION,
  isPaused: false,
  flashType: 'info',
  iconName: null,
  message: '',
  i18nParams: null,
  isError: false,
  infoUrl: null,
  infoText: null,
})

export const buildFlash = (params) => {
  return Flash({ id: uuidv4() }).merge(params)
}

export default Flash
