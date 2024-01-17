/**
 * @jest-environment jsdom
 */

import { t } from 'react-i18next'

import { ReputationGuardTooltip } from '../ReputationGuardTooltip'

const DEFAULT_CHILDREN = ({ hasReputation }) => `Has reputation: ${hasReputation}`

test("user doesn't have required reputation", () => {
  snapshotComponent(
    <ReputationGuardTooltip t={t} requiredRep={42} checkReputation={() => false}>
      {DEFAULT_CHILDREN}
    </ReputationGuardTooltip>
  )
})

test('user have required reputation', () => {
  snapshotComponent(
    <ReputationGuardTooltip t={t} requiredRep={42} checkReputation={() => true}>
      {DEFAULT_CHILDREN}
    </ReputationGuardTooltip>
  )
})
