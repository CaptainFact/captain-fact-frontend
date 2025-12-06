describe('Can add and edit statements', () => {
  it('adds a new statement then edits it', () => {
    const statementText = `Cypress statement ${Date.now()}`
    const updatedStatementText = `${statementText} - edited`

    cy.login().then(() => {
      cy.visit('/videos/Jzqg')

      cy.contains('div', 'Add a Statement', { matchCase: false, timeout: 10000 }).parent().click()

      cy.get('#col-video')
        .find('a[href^="/s/"]')
        .first()
        .invoke('text')
        .then((speakerName) => {
          if (speakerName) {
            cy.get('input[name="speaker_id"]').type(`${speakerName.trim()}{enter}`, { force: true })
          }
        })

      cy.get('textarea[name="text"]').type(statementText)

      cy.contains('button[type=submit]', 'Save').click()

      cy.contains('blockquote', statementText, { timeout: 15000 }).should('exist')

      cy.contains('[data-cy="statement"]', statementText)
        .find('button[aria-haspopup="menu"]')
        .click()

      cy.contains('[role="menuitem"]', 'Edit').click()

      cy.get('textarea[name="text"]').clear().type(updatedStatementText)

      cy.contains('button[type=submit]', 'Save').click()

      cy.contains('[data-cy="statement"]', updatedStatementText, { timeout: 15000 }).should('exist')
    })
  })
})
