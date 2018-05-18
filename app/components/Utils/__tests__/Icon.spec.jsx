import Icon from '../Icon'

test('render icon', () => {
  snapshot(<Icon name="plus"/>)
})

test('set size', () => {
  snapshot(<Icon name="plus" size="large"/>)
})

test('other props get passed to container', () => {
  snapshot(<Icon name="plus" title="Add some stuff"/>)
})
