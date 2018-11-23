import { defaultUsername } from '../../support/helpers'

describe('Sidebar user section with a logged in user', () => {
  before(() => {
    cy.login()
    cy.visit('/')
  })

  beforeEach(() => {
    cy.get('#sidebar .user-section').as('userSection')
  })

  it('should contains username', () => {
    cy
      .get('@userSection')
      .find(`.username:contains(${defaultUsername})`)
      .should('exist')
  })

  it('should have a logout buttons', () => {
    cy
      .get('@userSection')
      .find('buttons[title="Logout"]')
      .should('exist')
  })

  it('should contains a link to user activity', () => {
    cy
      .get('@userSection')
      .contains('My Activity')
      .should('have.attr', 'href', `/u/${defaultUsername}/activity`)
  })

  it('should contains a link to user settings', () => {
    cy
      .get('@userSection')
      .contains('Settings')
      .should('have.attr', 'href', `/u/${defaultUsername}/settings`)
  })

  it('should hide user links on small screens', () => {
    cy.viewport(900, 575)

    // Ensure base links are still there
    cy.get('@userSection').find(`.username:contains(${defaultUsername})`).should('exist')
    cy.get('@userSection').find('buttons[title="Logout"]').should('exist')

    // Ensure other user links are hidden
    cy.get('@userSection').contains('My Activity').should('not.be.visible')
    cy.get('@userSection').contains('Settings').should('not.be.visible')
  })
})
