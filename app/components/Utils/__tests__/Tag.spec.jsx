import Tag from '../Tag'

test("render tag", () => {
  snapshot(<Tag>Test</Tag>)
})

test("set size", () => {
  snapshot(<Tag type="info">Test</Tag>)
})
