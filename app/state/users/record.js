import { Record, List } from "immutable"

const User = new Record({
  id: 0,
  email: '',
  fb_user_id: null,
  username: '',
  name: '',
  locale: '',
  reputation: 0,
  picture_url: null,
  mini_picture_url: null,
  registered_at: null,
  achievements: [],
  is_publisher: false,
  onboarding_completed: new List(),
  onboarding_skipped: false
})

export default User
