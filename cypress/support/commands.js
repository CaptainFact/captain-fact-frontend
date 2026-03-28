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
      // Also cache the user in localStorage using the camelCase shape that UserProvider
      // expects (mirroring what a successful loggedInUser GraphQL query would store).
      // This lets cy.login() work even when the GraphQL API is unavailable or returns
      // schema errors (e.g. when running against an older staging API).
      const cachedUser = {
        id: String(user.id),
        username: user.username,
        name: user.name,
        email: user.email,
        reputation: user.reputation,
        registeredAt: user.registered_at,
        pictureUrl: user.picture_url,
        miniPictureUrl: user.mini_picture_url,
        achievements: user.achievements,
        availableFlags: user.available_flags,
        isPublisher: user.is_publisher,
      }
      window.localStorage.setItem('loggedInUser', JSON.stringify(cachedUser))
      return user
    })
})

Cypress.Commands.add('visitNewRandomVideo', () => {
  cy.visit('/videos/add')
  cy.get('input[name=url]').type(randomYoutubeURL())
  cy.contains('button[type=submit]', 'Add this video').click()
})
