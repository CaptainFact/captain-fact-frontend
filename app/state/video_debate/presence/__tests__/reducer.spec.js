import reducer, { setPresence, presenceDiff } from '../reducer'


const INITIAL_STATE = reducer(undefined, {})

const mockPresenceEvent = ({
  userJoin = 0,
  viewerJoin = 0,
  userLeave = 0,
  viewerLeave = 0
}) => ({
  joins: {
    viewers: {count: viewerJoin},
    users: {count: userJoin},
  },
  leaves: {
    viewers: {count: viewerLeave},
    users: {count: userLeave},
  }
})

test('start at 0', () => snapshot(INITIAL_STATE))

test('set presence', () => {
  snapshotReducer(reducer, INITIAL_STATE,
    setPresence({viewers: {count: 42}, users: {count: 5}})
  )
})

test('presenceDiff', () => {
  snapshotReducer(reducer, INITIAL_STATE,
    presenceDiff(mockPresenceEvent({userJoin: 2, viewerJoin: 5})),
    presenceDiff(mockPresenceEvent({userLeave: 2, viewerJoin: 5})),
    presenceDiff(mockPresenceEvent({viewerLeave: 10})),
  )
})
