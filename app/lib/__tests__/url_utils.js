import { youtubeRegex, optionsToQueryString } from '../url_utils'


describe('Youtube regex', () => {
  it('should accept regular urls', () => {
    // Normal form
    expect(youtubeRegex.test("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true)
    // Without https://
    expect(youtubeRegex.test("www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true)
    // Short form
    expect(youtubeRegex.test("https://youtu.be/dQw4w9WgXcQ")).toBe(true)
    // Short form with get params
    expect(youtubeRegex.test("https://youtu.be/dQw4w9WgXcQ?t=42s")).toBe(true)
  })

  it('should reject invalid urls', () => {
    // Mising id
    expect(youtubeRegex.test("https://youtu.be")).toBe(false)
    // Channel
    expect(youtubeRegex.test("https://www.youtube.com/channel/UCQgWpmt02UtJkyO32HGUASQ")).toBe(false)
  })
})

describe('optionsToQueryString', () => {
  it('should return an empty string if given an empty map', () => {
    expect(optionsToQueryString({})).toBe("")
  })

  it('should map values', () => {
    expect(optionsToQueryString({hello: "world", value: 42})).toBe("?hello=world&value=42")
  })
})