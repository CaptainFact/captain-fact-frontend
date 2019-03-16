import Alert from '../Alert'

test('render message', () => {
  snapshotComponent(<Alert>Hello</Alert>)
})

test('can set type', () => {
  snapshotComponent(<Alert type="warning">Alert !</Alert>)
})

test('pass props', () => {
  snapshotComponent(<Alert title="my title">Hellooow</Alert>)
})

test('without body', () => {
  snapshotComponent(<Alert />)
})
