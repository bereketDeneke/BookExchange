const testUser = {
    email: `bd2249@nyu.edu`,
    password: '!@#passw0rd23'
  };

  const testBook = {
    title: 'Shadows of Tomorrow',
    description: 'In a dystopian future ruled by an AI-driven regime, a lone coder discovers fragments of forbidden knowledge that could restore humanity’s free will.',
    type: 'sale',
    price: 20,
};

describe('Book Offer Modal Tests', () => {
    before("Remove the sample book offer from the database if it exists.", () => {
        cy.task('deleteOffer', { ownerEmail: testUser.email, title: testBook.title })
          .then((result) => {
            if (result) {
              cy.log('Offer deleted successfully.');
            } else {
              cy.log('No matching offer found or failed to delete.');
            }
          });
    });

    beforeEach(() => {
        // Log in and navigate to the books page
        cy.visit('/login');
        cy.get('input[type="email"]').type(testUser.email);
        cy.get('input[type="password"]').type(testUser.password);
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
        // Verify successful login
        cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
        cy.get('img#profilePicture').click();

        // Redirect to profile page
        cy.url().should('include', '/profile');
        cy.get('.Profile_booksContainer__P3_g7').should('be.visible');
    });

    it('should open the Add Book modal', () => {
        // Click the "Add Book" button
        cy.get('.Profile_addBookButton__Bzct2').click();
    
        // Verify the modal is visible
        cy.get('#offerModal_overlay').should('be.visible');
        cy.get('h2').contains('Add New Book');
      });
    
      it('should display an error if the title is missing', () => {
        cy.get('.Profile_addBookButton__Bzct2').click();
        // Leave the title blank and try to submit
        cy.get('textarea#description').type(testBook.description);
        cy.get('select#type').select(testBook.type);
        cy.get('input#price').type(testBook.price);
        cy.get('button#submitButton').contains('Submit').click();
    
        // Verify error message
        cy.get('div#error').should('contain', 'Title is required');
      });
    
      it('should display an error if the description is missing', () => {
        cy.get('.Profile_addBookButton__Bzct2').click();
        // Leave the description blank and try to submit
        cy.get('input#title').type(testBook.title);
        cy.get('textarea#description').clear();
        cy.get('button#submitButton').contains('Submit').click();
    
        // Verify error message
        cy.get('div#error').should('contain', 'Description is required');
      });
    
      it('should display an error if the price is invalid for sale or rent type', () => {
        // Enter invalid price and try to submit
        cy.get('.Profile_addBookButton__Bzct2').click();
        cy.get('input#title').clear().type(testBook.title);
        cy.get('textarea#description').clear().type(testBook.description);
        cy.get('select#type').select(testBook.type);
        cy.get('input#price').clear().type('-1'); // Invalid price
        cy.get('button#submitButton').contains('Submit').click();
    
        // Verify error message
        cy.get('div#error').should('contain', 'Price must be a positive number');
      });
    
      it('should successfully submit the form and add the book', () => {
        cy.get('.Profile_addBookButton__Bzct2').click();
        // Fill in valid form data
        cy.get('input#title').clear().type(testBook.title);
        cy.get('textarea#description').clear().type(testBook.description);
        cy.get('select#type').select(testBook.type);
        cy.get('input#price').clear().type(testBook.price);
        cy.get('button#submitButton').contains('Submit').click();
    
        // Verify success message
        cy.get('div#success').should('contain', 'Offer created successfully!');
        cy.get('.offerModal_modal').should('not.exist'); // Modal should close
        
        cy.reload();
        // Verify the book appears in the collection
        cy.get('.Profile_booksContainer__P3_g7').within(() => {
            cy.get('.Profile_addBookButton__Bzct2').click();
          cy.contains('.Profile_bookCard__aGCEE h4', testBook.title)
            .should('exist')
            .parent()
            .within(() => {
              cy.contains('Type: sale').should('exist');
              cy.contains(`Price: $${testBook.price}`).should('exist');
            });
        });
      });
    
      it('should allow the modal to be canceled', () => {
        // Open the modal again
        cy.get('.Profile_addBookButton__Bzct2').click();
    
        // Click the "Cancel" button
        cy.get('button#cancelButton').contains('Cancel').click();
    
        // Verify the modal is closed
        cy.get('.offerModal_modal').should('not.exist');
      });

      after('Remove the sample offer', () => {
        cy.task('deleteOffer', {ownerEmail:testUser.email, title:testBook.title}).then((result) => {
          expect(result).to.be.true;
        });
      });
});