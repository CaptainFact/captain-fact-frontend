import { random, times } from 'lodash'

// Default API

export const defaultApiUrl = Cypress.env('CYPRESS_API_URL')

// Default user variables

export const defaultEmail = Cypress.env('CYPRESS_EMAIL')

export const defaultUsername = Cypress.env('CYPRESS_USERNAME')

export const defaultPassword = Cypress.env('CYPRESS_PASSWORD')

// ts-unused-exports:disable-next-line
export const defaultUser = {
  email: defaultEmail,
  username: defaultUsername,
  password: defaultPassword,
}

// ts-unused-exports:disable-next-line
export const randomYoutubeId = () => {
  return times(13, () => random(35).toString(36)).join('')
}

export const randomYoutubeURL = () => {
  return `https://www.youtube.com/watch?v=${randomYoutubeId}`
}
