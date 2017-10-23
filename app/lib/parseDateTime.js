import parse from 'date-fns/parse'


export const parseUTC = date =>
  new Date(Date.UTC(
    date.getFullYear(), date.getMonth(), date.getDate(),
    date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()
  ));

const parseDateTime = dateStr =>
  parseUTC(parse(dateStr))

export default parseDateTime