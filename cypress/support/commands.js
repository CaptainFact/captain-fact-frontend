/* ***********************************************
 ** For more comprehensive examples of custom
 ** commands please read more here:
 ** https://on.cypress.io/custom-commands
 ** *********************************************
 */

import { defaultApiUrl, defaultEmail, defaultPassword, randomYoutubeURL } from './helpers'

Cypress.Commands.add('login', () => {
  return cy
    .request({
      method: 'POST',
      url: `${defaultApiUrl}/auth/identity/callback`,
      body: {
        email: defaultEmail,
        password: defaultPassword,
      },
    })
    .then((resp) => {
      const { user, token } = resp.body
      window.localStorage.setItem('token', token)
      return user
    })
})

Cypress.Commands.add('visitNewRandomVideo', () => {
  cy.visit('/videos/add')
  cy.get('input[name=url]').type(randomYoutubeURL())
  cy.contains('button[type=submit]', 'Add this video').click()
})
