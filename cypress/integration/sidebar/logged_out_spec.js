describe('Sidebar without a logged in user', () => {
  before(() => {
    cy.visit('/')
  })

  it('has a login buttons', () => {
    cy.get('#sidebar a[href="/login"]').should('exist')
  })
})
