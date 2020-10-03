import { Record } from 'immutable'

const User = new Record({
  id: 0,
  email: '',
  fb_user_id: null,
  username: '___________',
  name: '',
  locale: 'en',
  reputation: 0,
  picture_url: null,
  mini_picture_url: null,
  registered_at: null,
  achievements: [],
  is_publisher: false,
  speaker_id: null,
})

export default User
