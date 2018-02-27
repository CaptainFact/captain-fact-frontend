import { ReputationGuard } from '../ReputationGuard'

test("should not render anything if no permissions until specified otherwise", () => {
  const noReputation = shallow(
    <ReputationGuard hasReputation={false}>Hidden</ReputationGuard>
  )
  const loading = shallow(
    <ReputationGuard isLoading={true}>Hidden</ReputationGuard>
  )
  expect(noReputation.isEmptyRender()).toBeTruthy()
  expect(loading.isEmptyRender()).toBeTruthy()
})

test("should not crash if no children", () => {
  expect(shallow(<ReputationGuard/>).isEmptyRender()).toBeTruthy()
})

test("should render children if allowed to", () => {
  snapshot(<ReputationGuard hasReputation>HelloWorld</ReputationGuard>)
})

test("display loading", () => {
  snapshot(<ReputationGuard isLoading showLoading>HelloWorld</ReputationGuard>)
})

test("show error", () => {
  snapshot(<ReputationGuard hasReputation={false} showNotEnough>HelloWorld</ReputationGuard>)
})