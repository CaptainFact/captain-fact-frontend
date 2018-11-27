/* ***********************************************
 ** For more comprehensive examples of custom
 ** commands please read more here:
 ** https://on.cypress.io/custom-commands
 ** *********************************************
 */

import { defaultApiUrl, defaultEmail, defaultPassword } from './helpers'

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: `${defaultApiUrl}/auth/identity/callback`,
    body: {
      email: defaultEmail,
      password: defaultPassword
    }
  }).then(resp => {
    const { user, token } = resp.body
    window.localStorage.setItem('token', token)
    // TODO store user in store
  })
})
