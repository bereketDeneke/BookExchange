const testUser = {
  email: `bd2249@nyu.edu`,
  password: '!@#passw0rd23'
};

describe('Login Page Tests', () => {
  before("Login Page", () => {  
    cy.visit('/login');
  });

  it('should display the login form with correct elements', () => {
    // Verify the form structure
    cy.get('h2').should('contain', 'Login');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('input#rememberMe').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Login');
  });


  it('should redirect to the register page when clicking "Create Account"', () => {
    cy.visit('/login');
    // Click the "Create Account" link
    cy.get('a').contains('Create Account').click();

    // Verify redirection
    cy.url().should('eq', `${Cypress.config('baseUrl')}/register`);
  });

  it('should display an error for invalid login credentials', () => {
    cy.visit('/login');
    // Enter invalid credentials
    cy.get('input[type="email"]').type('invaliduser@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Verify error message
    cy.get('p#error').should('contain', 'Invalid email or password');
  });

  it('should login successfully with valid credentials', () => {
    cy.visit('/login');
    // Enter valid credentials
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').type(testUser.password);
    cy.get('input#rememberMe').check();
    cy.get('button[type="submit"]').click();

    // Verify success message and redirection
    cy.get('p#success').should('contain', 'Login successful');
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    cy.get('img[alt="Profile"]').should('exist');
  });
});
