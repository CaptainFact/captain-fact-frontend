describe('Navbar without a logged in user', () => {
  before(() => {
    cy.visit('/')
  })

  it('has login / signup / download extension buttons', () => {
    cy.get('[data-cy="Navbar"] a[href="/login"]').should('exist')
    cy.get('[data-cy="Navbar"] a[href="/extension"]').should('exist')
  })
})
