import { t } from "react-i18next"
import { ReputationGuardTooltip } from "../ReputationGuardTooltip"

const DEFAULT_CHILDREN = ({ hasReputation }) => `Has reputation: ${hasReputation}`

test("user doesn't have required reputation", () => {
  snapshotComponent(
    <ReputationGuardTooltip t={t} requiredRep={42} hasReputation={false}>
      {DEFAULT_CHILDREN}
    </ReputationGuardTooltip>,
  )
})

test("user have required reputation", () => {
  snapshotComponent(
    <ReputationGuardTooltip t={t} requiredRep={42} hasReputation>
      {DEFAULT_CHILDREN}
    </ReputationGuardTooltip>,
  )
})
