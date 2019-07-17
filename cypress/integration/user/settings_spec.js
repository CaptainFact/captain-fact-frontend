import faker from 'faker'
import { defaultUsername } from '../../support/helpers'

describe('Settings', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.visit(`/u/${defaultUsername}/settings`)
    })
  })

  it('can change language', () => {
    cy.get('.user-page .language-selector select')
      .select('fr')
      .should('have.value', 'fr')
    cy.contains('Langue').should('exist')
  })

  it('can edit name', () => {
    const newName = faker.name.findName()
    cy.get('input[name="name"]')
      .clear()
      .type(`${newName}{enter}`)
      .then(() => {
        cy.get('.main-appelation').should('be', newName)
        cy.get('input[name="name"]').should('be', newName)
      })
  })

  it("fails to change password if they doesn't match", () => {
    cy.get('input[name="password"]')
      .clear()
      .type('password{enter}')
    cy.get('input[name="passwordRepeat"]')
      .clear()
      .type('notTheSame{enter}')
      .blur()
    cy.contains("Passwords doesn't match").should('exist')
  })
})
