import iterator from '../iterate_with_separators'


const SEPARATOR = 'and'
const testTranslateFunc = k => (k === 'main:misc.and' ? SEPARATOR : '')
const iteratorTester = list => Array.from(iterator(list, list.length, testTranslateFunc))

it('should work with empty lists', () => {
  expect(iteratorTester([])).toEqual([])
})

it('should return a list of values with separators', () => {
  expect(iteratorTester(['hello']))
    .toEqual([['hello', '']])

  expect(iteratorTester(['bananas', 'coconuts']))
    .toEqual([['bananas', ' and '], ['coconuts', '']])

  expect(iteratorTester(['bananas', 'coconuts', 'pineapple']))
    .toEqual([['bananas', ', '], ['coconuts', ' and '], ['pineapple', '']])
})
