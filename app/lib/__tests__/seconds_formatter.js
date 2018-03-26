import formatter from '../seconds_formatter'


it('should correctly convert seconds', () => {
  expect(formatter(0)).toBe('0:00:00')
  expect(formatter(4)).toBe('0:00:04')
  expect(formatter(42)).toBe('0:00:42')
  expect(formatter(60)).toBe('0:01:00')
  expect(formatter(100)).toBe('0:01:40')
  expect(formatter(3600)).toBe('1:00:00')
  expect(formatter(4000)).toBe('1:06:40')
  expect(formatter(1527273762)).toBe('424242:42:42')
})

it('should display a negative sign for negative times', () => {
  expect(formatter(-42)).toBe('-0:00:42')
})