import { Record, List } from 'immutable'

const Video = new Record({
  id: 0,
  posted_at: 0,
  provider: '',
  provider_id: 0,
  url: '',
  title: '',
  speakers: new List(),
  language: null
})
export default Video