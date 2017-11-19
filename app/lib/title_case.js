/**
 * A very simple title case that in contrast to `voca/title_case` respect the ' character
 * (speaker's assistant -> Speaker's Assistant) and the · (middle point) character, especially
 * used in French for gender-neutral form (un·e député·e)
*/


import capitalize from 'voca/capitalize'

const WORD_REGEX = /[^\s\-]+/g

const titleCase = str => String(str).replace(WORD_REGEX, capitalize)

export default titleCase
