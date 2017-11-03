import { Record } from "immutable"


const User = new Record({
  id: 0,
  email: "",
  fb_user_id: null,
  username: "",
  name: "",
  locale: "",
  reputation: 0,
  picture_url: null,
  mini_picture_url: null,
  registered_at: null,
  achievements: []
})

export default User