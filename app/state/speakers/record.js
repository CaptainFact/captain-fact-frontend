import { Record } from "immutable"

const Speaker = new Record({
  id: 0,
  slug: null,
  full_name: "",
  title: "",
  picture: "",
  country: null,
  is_user_defined: undefined,
  wikidata_item_id: null
})
export default Speaker