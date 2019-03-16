/**
 * Iterate a list, returning for each entry a tuple like [item, textSeparatorAfter]
 * @param iterator
 * @param size the number of elements to read from iterator
 * @param t a translate function
 * @param endWithAnd whether the last separator is a "and" or a comma (default is true)
 */
export default function* iterateWithSeparators(iterator, size, t, endWithAnd = true) {
  let entryNum = -1
  for (const value of iterator) {
    entryNum += 1
    if (entryNum === size) break
    else if (entryNum + 2 === size && endWithAnd) yield [value, ` ${t('main:misc.and')} `]
    else if (entryNum + 2 <= size) yield [value, ', ']
    else yield [value, '']
  }
}
