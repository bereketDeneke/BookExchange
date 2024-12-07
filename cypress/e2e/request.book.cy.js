const testUser = {
    email: `bd2249@nyu.edu`,
    password: '!@#passw0rd23'
  };
  
  describe('Book Request Modal Tests', () => {
    beforeEach(() => {
      // Log in and navigate to the books page
      cy.visit('/login');
      cy.get('input[type="email"]').type(testUser.email);
      cy.get('input[type="password"]').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    });
  
    it('should open the modal for the selected book and submit a request', () => {
      // Find the "ፍቅር እስከ መቃብር" book card and click the "Request" button
      cy.contains('.book-card h2', 'ፍቅር እስከ መቃብር')
        .parents('.book-card')
        .find('button')
        .contains('Request')
        .click();
  
      // Verify the modal opens with the correct content
      cy.get('.bookDetailModal_modalContent__5x3k8').should('be.visible');
      cy.get('.bookDetailModal_modalContent__5x3k8 h2').should('contain', 'ፍቅር እስከ መቃብር');
  
      // Fill out the modal form
      cy.get('#urgency').select('High');
      cy.get('#duration').clear().type('10'); // For sale/rent: Enter price; for free: number of weeks
      cy.get('#reason').type('I need this book for my research on Ethiopian literature.');
      cy.get('.bookDetailModal_starRating__PHBLp span').eq(4).click(); // Rate 5 stars
  
      // Submit the form
      cy.get('.bookDetailModal_submitButton__cvkMN').click();
  
      // Verify success message or modal closure
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Your request has been submitted!');
      });
  
      // Verify modal closes after submission
      cy.get('.bookDetailModal_modalContent__5x3k8').should('not.exist');
    });
  
    it('should allow cancellation of the modal', () => {
      // Reopen the modal
      cy.contains('.book-card h2', 'ፍቅር እስከ መቃብር')
        .parents('.book-card')
        .find('button')
        .contains('Request')
        .click();
  
      // Verify the modal is open
      cy.get('.bookDetailModal_modalContent__5x3k8').should('be.visible');
  
      // Click the "Cancel" button
      cy.get('.bookDetailModal_cancelButton__3b0dZ').click();
  
      // Verify the modal closes
      cy.get('.bookDetailModal_modalContent__5x3k8').should('not.exist');
    });
  
    it('should display an error message for invalid input', () => {
      // Open the modal
      cy.contains('.book-card h2', 'ፍቅር እስከ መቃብር')
        .parents('.book-card')
        .find('button')
        .contains('Request')
        .click();
  
      // Leave the reason empty and try to submit
      cy.get('#urgency').select('Low');
      cy.get('#duration').clear().type('0'); // Invalid value
      cy.get('#reason').clear(); // Clear the reason
      cy.get('.bookDetailModal_submitButton__cvkMN').click();
  
      // Verify error message
      cy.on('window:alert', (str) => {
        expect(str).to.include('Reason is required');
      });
  
      // Verify modal stays open
      cy.get('.bookDetailModal_modalContent__5x3k8').should('be.visible');

      // Click the "Cancel" button
      cy.get('.bookDetailModal_cancelButton__3b0dZ').click();
    });

    it('should find the requested book in My Requests', () => {
        // Navigate to "My Requests" tab
        cy.get('span.myRequests').contains('My Requests').click();
    
        cy.contains('.MyRequests_requestCard__PnTlh .MyRequests_bookTitle__zI8Pu', 'Request for: ፍቅር እስከ መቃብር')
        .parents('.MyRequests_requestCard__PnTlh')
        .within(() => {
          cy.get('p').should('contain', 'Urgency: high');
          cy.get('p').should('contain', 'Reason: I need this book for my research on Ethiopian literature.');
          cy.get('p').should('contain', "Buyer’s Proposed Price: $10");
          cy.get('p').should('contain', "Original Price: $50");
        });
      });

    
      it('should remove the request for the book', () => {
        // Navigate to "My Requests" tab
        cy.get('span.myRequests').contains('My Requests').click();
        
        cy.contains('.MyRequests_requestCard__PnTlh .MyRequests_bookTitle__zI8Pu', 'Request for: ፍቅር እስከ መቃብር')
        .parents('.MyRequests_requestCard__PnTlh')
        .within(() => {
          cy.contains('button#cancelRequest', 'Cancel Request').click();
        });
  
        // Verify the request is removed
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Request removed successfully.');
        });
        
        cy.reload();
        // Ensure the book is no longer listed
        cy.contains('.MyRequests_requestCard__PnTlh h2.MyRequests_bookTitle__zI8Pu', 'Request for: ፍቅር እስከ መቃብር').should('not.exist');
      });   
  });
  