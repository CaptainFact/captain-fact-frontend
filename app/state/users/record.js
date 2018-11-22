import { Record } from 'immutable'


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
  speaker_id: null,
  city: {
    name: 'Trjvednaja',
    temperature: '19.5°C',
    population: 9.854
  }, // fake data for POC ; user should be able to set his/her city name
})

export default User
