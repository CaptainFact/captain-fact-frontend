import {
  getReactPlayerVolume,
  normalizePercentagePlayerVolume,
  normalizePlayerVolume,
} from '../player_volume'

describe('normalizePlayerVolume', () => {
  it('keeps html media volumes in the 0-1 range', () => {
    expect(normalizePlayerVolume(0)).toBe(0)
    expect(normalizePlayerVolume(0.35)).toBe(0.35)
    expect(normalizePlayerVolume(1)).toBe(1)
  })

  it('ignores invalid values and clamps out-of-range values', () => {
    expect(normalizePlayerVolume(undefined)).toBe(null)
    expect(normalizePlayerVolume('quiet')).toBe(null)
    expect(normalizePlayerVolume(-0.5)).toBe(0)
    expect(normalizePlayerVolume(1.5)).toBe(1)
  })
})

describe('normalizePercentagePlayerVolume', () => {
  it('converts player volumes in the 0-100 range', () => {
    expect(normalizePercentagePlayerVolume(1)).toBe(0.01)
    expect(normalizePercentagePlayerVolume(35)).toBe(0.35)
    expect(normalizePercentagePlayerVolume(100)).toBe(1)
  })

  it('ignores invalid values and clamps out-of-range values', () => {
    expect(normalizePercentagePlayerVolume(undefined)).toBe(null)
    expect(normalizePercentagePlayerVolume('quiet')).toBe(null)
    expect(normalizePercentagePlayerVolume(-50)).toBe(0)
    expect(normalizePercentagePlayerVolume(150)).toBe(1)
  })
})

describe('getReactPlayerVolume', () => {
  it('reads YouTube-style getVolume players', () => {
    const player = { getInternalPlayer: () => ({ getVolume: () => 42 }) }

    expect(getReactPlayerVolume(player)).toBe(0.42)
  })

  it('treats low YouTube-style getVolume values as percentages', () => {
    const player = { getInternalPlayer: () => ({ getVolume: () => 1 }) }

    expect(getReactPlayerVolume(player)).toBe(0.01)
  })

  it('reads html media volume properties', () => {
    const player = { getInternalPlayer: () => ({ volume: 0.65 }) }

    expect(getReactPlayerVolume(player)).toBe(0.65)
  })

  it('honors muted player state', () => {
    expect(
      getReactPlayerVolume({
        getInternalPlayer: () => ({ getVolume: () => 42, isMuted: () => true }),
      }),
    ).toBe(0)
    expect(getReactPlayerVolume({ getInternalPlayer: () => ({ muted: true, volume: 0.65 }) })).toBe(
      0,
    )
  })

  it('returns null when volume cannot be read', () => {
    expect(getReactPlayerVolume(null)).toBe(null)
    expect(getReactPlayerVolume({ getInternalPlayer: () => ({}) })).toBe(null)
    expect(
      getReactPlayerVolume({
        getInternalPlayer: () => {
          throw new Error('not ready')
        },
      }),
    ).toBe(null)
  })
})
