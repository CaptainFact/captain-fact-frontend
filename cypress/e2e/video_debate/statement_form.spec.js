describe('Can add and edit statements', () => {
  it('adds a new statement', () => {
    const statementText = `Cypress statement ${Date.now()}`

    cy.login().then(() => {
      cy.visit('/videos/Jzqg')

      // Add a statement
      cy.contains('[data-cy="action-bubble"]', 'Add a Statement').click()
      cy.get('[data-cy="statement-form"] textarea[name="text"]').type(statementText)
      cy.contains('button[type=submit]', 'Save').click()

      cy.contains('A speaker should be added. To continue without one, press "Save".').should(
        'exist',
      )
      cy.contains('button[type=submit]', 'Save').click()
      cy.contains('[data-cy="statement"]', statementText, { timeout: 15000 }).should('exist')
    })
  })
})
