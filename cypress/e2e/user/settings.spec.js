import faker from 'faker'

describe('Settings', () => {
  beforeEach(() => {
    cy.login().then((user) => {
      cy.visit(`/u/${user.username}/settings`)
    })
  })

  it('can change language', () => {
    cy.get('[data-cy="user-settings"] [data-cy="language-selector"] button').click()
    cy.get('[data-cy="language-selector-options"]').contains('Français').click()
    cy.contains('Langue').should('exist')
  })

  it('can edit name', () => {
    const newName = faker.name.firstName()
    cy.get('input[name="name"]')
      .clear()
      .type(`${newName}{enter}`)
      .then(() => {
        cy.get('[data-cy="user-appellation"]').should('contain', newName)
        cy.get('input[name="name"]').should('have.value', newName)
      })
  })

  it("fails to change password if they don't match", () => {
    cy.get('input[name="password"]').clear().type('password{enter}')
    cy.get('input[name="passwordRepeat"]').clear().type('notTheSame{enter}').blur()
    cy.contains("Passwords don't match").should('exist')
  })
})
