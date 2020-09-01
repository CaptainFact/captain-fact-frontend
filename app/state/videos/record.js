import { Record, List } from 'immutable'

const Video = new Record({
  id: 0,
  hash_id: null,
  posted_at: 0,
  youtube_id: null,
  youtube_offset: 0,
  url: '',
  title: '',
  speakers: new List(),
  language: null,
  is_partner: null,
  unlisted: false,
})

export default Video
