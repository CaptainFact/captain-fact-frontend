import "babel-polyfill"


/**
 * Iterate a list, returning for each entry a tuple like [item, textSeparatorAfter]
 * @param iterator
 * @param size
 * @param t a translate function
 */
export default function *iterateWithSeparators(iterator, size, t) {
  let entryNum = -1
  for (let value of iterator) {
    entryNum += 1
    if (entryNum + 3 <= size)
      yield [value, ", "]
    else if (entryNum + 2 === size)
      yield [value, ` ${t('main:misc.and')} `]
    else
      yield [value, ""]
  }
}