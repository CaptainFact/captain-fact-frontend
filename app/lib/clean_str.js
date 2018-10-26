import trimLeft from 'voca/trim_left'

export const cleanStr = (str) => trimLeft(str.replace(/\s{2,}/g, ' '))

/**
* Same as cleanStr but preserve multiple lines. Only trim the end of input
* to avoid breaking caret position.
*
* @param {String} str
* @return {String} clean string
*/
export const cleanStrMultiline = str => trimLeft(
  str
    .replace(/(\s(?!\n)){2,}$/g, ' ') // Trim spaces / tabs
    .replace(/\n{3,}$/g, '\n\n') // Trim newline characters
)
