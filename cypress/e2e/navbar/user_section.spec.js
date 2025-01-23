describe('Navbar with a logged in user', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
    cy.get('[data-cy=Navbar]').as('Navbar')
  })

  it('should contains user picture', () => {
    cy.get('@Navbar').find('[data-cy="user-picture"]').should('exist')
  })
})
