/**
 * @jest-environment jsdom
 */

import { isExternal, optionsToQueryString, youtubeRegex } from '../url_utils'

describe('Youtube regex', () => {
  it('should accept regular urls', () => {
    // Normal form
    expect(youtubeRegex.test('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true)
    // Without https://
    expect(youtubeRegex.test('www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true)
    // Short form
    expect(youtubeRegex.test('https://youtu.be/dQw4w9WgXcQ')).toBe(true)
    // Short form with get params
    expect(youtubeRegex.test('https://youtu.be/dQw4w9WgXcQ?t=42s')).toBe(true)
    // Embedded form
    expect(youtubeRegex.test('https://www.youtube.com/embed/LMRdn_MQWXM')).toBe(true)
  })

  it('should reject invalid urls', () => {
    // Mising id
    expect(youtubeRegex.test('https://youtu.be')).toBe(false)
    // Channel
    expect(youtubeRegex.test('https://www.youtube.com/channel/UCQgWpmt02UtJkyO32HGUASQ')).toBe(
      false
    )
    // Empty string
    expect(youtubeRegex.test('')).toBe(false)
    // Random string
    expect(youtubeRegex.test(Math.random().toString(36).substring(7))).toBe(false)
  })
})

describe('optionsToQueryString', () => {
  it('should return an empty string if given an empty map', () => {
    expect(optionsToQueryString({})).toBe('')
  })

  it('should map values', () => {
    expect(optionsToQueryString({ hello: 'world', value: 42 })).toBe('?hello=world&value=42')
  })
})

const MOCK_URL = 'https://captainfact.io/help/gandhi'

describe('is external', () => {
  it('should detect external links', () => {
    expect(isExternal(MOCK_URL, 'http://google.com')).toBe(true)
    expect(isExternal(MOCK_URL, 'https://google.com')).toBe(true)
    expect(isExternal(MOCK_URL, '//google.com')).toBe(true)
    expect(isExternal(MOCK_URL, 'mailto:mail@example.com')).toBe(true)
    expect(isExternal(MOCK_URL, 'http://samedomain.com:8080/port')).toBe(true)
    expect(isExternal(MOCK_URL, 'https://samedomain.com/secure')).toBe(true)
  })
  it('should detect internal links', () => {
    expect(isExternal(MOCK_URL, MOCK_URL)).toBe(false)
    expect(isExternal(MOCK_URL, MOCK_URL.replace('https://', 'HTTPS://'))).toBe(false)
    expect(isExternal(MOCK_URL, '/about')).toBe(false)
    expect(isExternal(MOCK_URL, 'image.jpg')).toBe(false)
    expect(isExternal(MOCK_URL, '#anchor')).toBe(false)
  })
})
