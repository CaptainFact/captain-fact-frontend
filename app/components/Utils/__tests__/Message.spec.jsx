import Message from "../Message"

test("render message", () => {
  snapshotComponent(<Message>Hello</Message>)
})

test("can set type", () => {
  snapshotComponent(<Message type="warning">Alert !</Message>)
})

test("can set header", () => {
  snapshotComponent(<Message header="Awesome title">Hellooow</Message>)
})

test("without body", () => {
  snapshotComponent(<Message />)
})
