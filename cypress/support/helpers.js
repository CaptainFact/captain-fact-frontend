// Default API

export const defaultApiUrl = Cypress.env('CYPRESS_API_URL')

// Default user variables

export const defaultEmail = Cypress.env('CYPRESS_EMAIL')

export const defaultUsername = Cypress.env('CYPRESS_USERNAME')

export const defaultPassword = Cypress.env('CYPRESS_PASSWORD')

export const defaultUser = {
  email: defaultEmail,
  username: defaultUsername,
  password: defaultPassword
}
