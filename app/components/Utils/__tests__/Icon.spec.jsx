import Icon from '../Icon'

test('render icon', () => {
  snapshotComponent(<Icon name="plus"/>)
})

test('set size', () => {
  snapshotComponent(<Icon name="plus" size="large"/>)
})

test('other props get passed to container', () => {
  snapshotComponent(<Icon name="plus" title="Add some stuff"/>)
})
