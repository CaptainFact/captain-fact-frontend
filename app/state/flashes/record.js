import { Record } from 'immutable'
import uuidv1 from 'uuid/v1'
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
  infoText: null
})

export const buildFlash = params => {
  return Flash({ id: uuidv1() }).merge(params)
}

export default Flash
