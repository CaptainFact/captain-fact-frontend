import { getReactPlayerVolume, normalizePlayerVolume } from '../player_volume'

describe('normalizePlayerVolume', () => {
  it('keeps html media volumes in the 0-1 range', () => {
    expect(normalizePlayerVolume(0)).toBe(0)
    expect(normalizePlayerVolume(0.35)).toBe(0.35)
    expect(normalizePlayerVolume(1)).toBe(1)
  })

  it('converts player volumes in the 0-100 range', () => {
    expect(normalizePlayerVolume(35)).toBe(0.35)
    expect(normalizePlayerVolume(100)).toBe(1)
  })

  it('ignores invalid values and clamps out-of-range values', () => {
    expect(normalizePlayerVolume(undefined)).toBe(null)
    expect(normalizePlayerVolume('quiet')).toBe(null)
    expect(normalizePlayerVolume(-0.5)).toBe(0)
    expect(normalizePlayerVolume(150)).toBe(1)
  })
})

describe('getReactPlayerVolume', () => {
  it('reads YouTube-style getVolume players', () => {
    const player = { getInternalPlayer: () => ({ getVolume: () => 42 }) }

    expect(getReactPlayerVolume(player)).toBe(0.42)
  })

  it('reads html media volume properties', () => {
    const player = { getInternalPlayer: () => ({ volume: 0.65 }) }

    expect(getReactPlayerVolume(player)).toBe(0.65)
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
