import { Record } from 'immutable'

const Statement = new Record({
  id: 0,
  text: '',
  time: 0,
  speaker_id: 0,
  is_draft: false,
})
export default Statement
