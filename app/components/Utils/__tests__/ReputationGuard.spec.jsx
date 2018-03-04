import User from '../../../state/users/record'
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

test("can specify a custom verifyFunc", () => {
  const templateUser = new User({id: 420056})
  const truthyVerify = shallow(
    <ReputationGuard hasReputation={false} user={templateUser} verifyFunc={(user, hasReputation) => {
        expect(user.id).toBe(templateUser.id)
        expect(hasReputation).toBeFalsy()
        return true
      }}>
        AwesomeValue
    </ReputationGuard>
  )
  expect(truthyVerify.text()).toBe("AwesomeValue")

  const falsyVerify = shallow(
    <ReputationGuard hasReputation={true} user={templateUser} verifyFunc={(user, hasReputation) => {
      expect(user.id).toBe(templateUser.id)
      expect(hasReputation).toBeTruthy()
      return false
    }}>
      AwesomeValue
    </ReputationGuard>
  )
  expect(falsyVerify.isEmptyRender()).toBeTruthy()
})