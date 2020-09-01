export default function capitalizeName(str) {
  return str.replace(/(?:(?!-|\s).)+/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}
