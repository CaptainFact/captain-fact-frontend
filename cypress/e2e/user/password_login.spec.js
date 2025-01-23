import { defaultEmail, defaultPassword, defaultUsername } from '../../support/helpers'

describe('User login', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/login')
  })

  it('has a link to reset password', () => {
    cy.get('[data-cy="sign-in-up-container"]')
      .contains('a', 'Forgotten password')
      .should('have.attr', 'href', '/reset_password')
  })

  it('has a link to register', () => {
    cy.get('[data-cy="sign-in-up-container"]')
      .find('a[href="/signup"]:contains("Sign up")')
      .should('exist')
  })

  it('works with default dev account when using email', () => {
    cy.get('input[name=email]').type(defaultEmail)
    cy.get('input[name=password]').type(defaultPassword)
    cy.contains('[data-cy="sign-in-up-container"] button', 'Log in').click()
    cy.url()
      .should('include', '/videos')
      .then(() => {
        cy.wait(1500).then(() => {
          expect(localStorage.getItem('token')).to.exist
        })
      })
  })

  it('works with default dev account when using username', () => {
    cy.get('input[name=email]').type(defaultUsername)
    cy.get('input[name=password]').type(defaultPassword)
    cy.contains('[data-cy="sign-in-up-container"] button', 'Log in').click()
    cy.url()
      .should('include', '/videos')
      .then(() => {
        cy.wait(1500).then(() => {
          expect(localStorage.getItem('token')).to.exist
        })
      })
  })

  it('validates form when pressing Enter', () => {
    cy.get('input[name=email]').type(defaultEmail)
    cy.get('input[name=password]').type(`${defaultPassword}{enter}`)
    cy.url().should('include', '/videos')
  })
})
