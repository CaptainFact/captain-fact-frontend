import Tag from '../Tag'

test('render tag', () => {
  snapshotComponent(<Tag>Test</Tag>)
})

test('set size', () => {
  snapshotComponent(<Tag type="info">Test</Tag>)
})
