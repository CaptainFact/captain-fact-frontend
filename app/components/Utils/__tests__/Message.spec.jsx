import Message from '../Message'

test("render message", () => {
  snapshot(<Message>Hello</Message>)
})

test("can set type", () => {
  snapshot(<Message type="warning">Alert !</Message>)
})

test("can set header", () => {
  snapshot(<Message header="Awesome title">Hellooow</Message>)
})

test("without body", () => {
  snapshot(<Message/>)
})
