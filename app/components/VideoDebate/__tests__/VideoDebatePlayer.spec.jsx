import { readInternalPlayerVolume } from '../VideoDebatePlayer'

describe('readInternalPlayerVolume', () => {
  it('returns null when no volume is available', () => {
    expect(readInternalPlayerVolume(null)).toBeNull()
    expect(readInternalPlayerVolume({})).toBeNull()
  })

  it('returns zero for muted players', () => {
    expect(readInternalPlayerVolume({ isMuted: () => true, getVolume: () => 50 })).toBe(0)
    expect(readInternalPlayerVolume({ muted: true, volume: 0.5 })).toBe(0)
  })

  it('normalizes provider volume ranges', () => {
    expect(readInternalPlayerVolume({ getVolume: () => 42 })).toBe(0.42)
    expect(readInternalPlayerVolume({ getVolume: () => 0.5 })).toBe(0.5)
    expect(readInternalPlayerVolume({ volume: 0.25 })).toBe(0.25)
  })
})
