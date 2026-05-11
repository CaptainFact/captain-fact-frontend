import { getInternalPlayerVolume } from '../VideoDebatePlayer'

describe('getInternalPlayerVolume', () => {
  it('returns null when no readable volume is available', () => {
    expect(getInternalPlayerVolume(null)).toBeNull()
    expect(getInternalPlayerVolume({})).toBeNull()
  })

  it('returns zero when the internal player is muted', () => {
    expect(getInternalPlayerVolume({ isMuted: () => true, getVolume: () => 50 })).toBe(0)
    expect(getInternalPlayerVolume({ muted: true, volume: 0.5 })).toBe(0)
  })

  it('normalizes provider volume ranges', () => {
    expect(getInternalPlayerVolume({ getVolume: () => 42 })).toBe(0.42)
    expect(getInternalPlayerVolume({ getVolume: () => 0.5 })).toBe(0.5)
    expect(getInternalPlayerVolume({ volume: 0.25 })).toBe(0.25)
  })
})
