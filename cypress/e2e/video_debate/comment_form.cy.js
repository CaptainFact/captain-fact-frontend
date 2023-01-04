describe('Can comment on statements', () => {
  it('with different types of comment', () => {
    cy.login().then((user) => {
      cy.visit('/videos/Jzqg')

      // Expand form
      cy.contains('button', 'Add a source or comment').click()

      // Check form
      cy.get('.comment-form .image img').should('have.attr', 'src', user.picture_url)

      cy.get('.comment-form textarea[name=text]').should(
        'have.attr',
        'placeholder',
        'Write a comment…'
      )

      cy.get('.comment-form input[name=source]').should('have.attr', 'placeholder', 'Add a source')

      cy.contains('button[type=submit]', 'Post comment').should('be.disabled')

      // Regular comment without source
      const commentText = 'Just a regular comment without source.'
      cy.get('.comment-form textarea[name=text]').type(commentText)
      cy.contains(
        '.comment-form .textarea-length-counter',
        new RegExp(`${commentText.length}\\s/\\s512`)
      )
      cy.contains('button[type=submit]', 'Post comment').should('not.be.disabled')
      cy.contains('button[type=submit]', 'Post comment').click()
      cy.contains('.comments', commentText)

      // Regular comment with source
      const commentWithSourceText = 'Just a regular comment with source.'
      const regularSourceUrl = 'https://en.wikipedia.org/wiki/Frank_Zappa'
      cy.get('.comment-form textarea[name=text]').type(commentWithSourceText)
      cy.get('.comment-form input[name=source]').type(regularSourceUrl)
      cy.contains('button[type=submit]', 'Post comment').should('not.be.disabled')
      cy.contains('button[type=submit]', 'Post comment').click()
      cy.contains('.comments', commentWithSourceText)
      cy.contains('.comments', 'EN.WIKIPEDIA.ORG')
      cy.contains('.comments', 'Frank Zappa')

      // Refute with source
      const commentRefuteText = 'This is FAKE NEWS!!!'
      const refuteSource = 'https://en.wikipedia.org/wiki/Pink-necked_green_pigeon'
      cy.get('.comment-form textarea[name=text]').type(commentRefuteText)
      cy.get('.comment-form input[name=source]').type(refuteSource)
      cy.contains('button[type=submit]', 'Refute').click()
      cy.contains('.comments-list.refute', commentRefuteText)
      cy.contains('.comments-list.refute', 'EN.WIKIPEDIA.ORG')
      cy.contains('.comments-list.refute', 'Pink-necked green pigeon')

      // Confirm with source
      const confirmSource = 'https://en.wikipedia.org/wiki/The_Star_Rover'
      cy.get('.comment-form input[name=source]').type(confirmSource)
      cy.contains('button[type=submit]', 'Approve').click()
      cy.contains('.comments-list.approve', 'EN.WIKIPEDIA.ORG')
      cy.contains('.comments-list.approve', 'The Star Rover')
    })
  })
})
