import Notification from "../Notification"

test("render message", () => {
  snapshotComponent(<Notification>Hello</Notification>)
})

test("can set type", () => {
  snapshotComponent(<Notification type="warning">Alert !</Notification>)
})

test("pass props", () => {
  snapshotComponent(<Notification title="my title">Hellooow</Notification>)
})

test("without body", () => {
  snapshotComponent(<Notification />)
})
