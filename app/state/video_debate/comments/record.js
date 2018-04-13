import { Record } from 'immutable'

import User from '../../users/record'
import Source from './source_record'


const Comment = new Record({
  id: 0,
  reply_to_id: null,
  is_reported: false,
  user: new User(),
  source: new Source(),
  statement_id: 0,
  text: '',
  approve: false,
  inserted_at: new Date(),
  score: 0
})

export default Comment