import Notification from '../Notification'

test("render message", () => {
  snapshot(<Notification>Hello</Notification>)
})

test("can set type", () => {
  snapshot(<Notification type="warning">Alert !</Notification>)
})

test("pass props", () => {
  snapshot(<Notification title="my title">Hellooow</Notification>)
})

test("without body", () => {
  snapshot(<Notification/>)
})
