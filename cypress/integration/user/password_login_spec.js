import { defaultEmail, defaultUsername, defaultPassword } from '../../support/helpers'

describe('User login', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/login')
  })

  it('has a link to reset password', () => {
    cy.contains('Forgotten password').should('have.attr', 'href', '/reset_password')
  })

  it('has a link to register', () => {
    cy.get('a[href="/signup"]:contains("Sign up")').should('exist')
  })

  it('works with default dev account when using email', () => {
    cy.get('input[name=email]').type(defaultEmail)
    cy.get('input[name=password]').type(defaultPassword)
    cy.get('.user-form .buttons:contains("Login")').click()
    cy.url().should('be', '/videos').then(() => {
      cy.wait(1500).then(() => {
        expect(localStorage.getItem('token')).to.exist
      })
    })
  })

  it('works with default dev account when using username', () => {
    cy.get('input[name=email]').type(defaultUsername)
    cy.get('input[name=password]').type(defaultPassword)
    cy.get('.user-form .buttons:contains("Login")').click()
    cy.url().should('be', '/videos').then(() => {
      cy.wait(1500).then(() => {
        expect(localStorage.getItem('token')).to.exist
      })
    })
  })

  it('validates form when pressing Enter', () => {
    cy.get('input[name=email]').type(defaultEmail)
    cy.get('input[name=password]').type(`${defaultPassword}{enter}`)
    cy.url().should('be', '/videos')
  })
})
