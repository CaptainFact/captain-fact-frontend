import { Record } from 'immutable'

const Speaker = new Record({
  id: 0,
  slug: null,
  full_name: '',
  title: '',
  picture: '',
  country: null,
  wikidata_item_id: null
})
export default Speaker
