const testUser = {
  username: "Bereket Deneke",
  email: `test12455@nyu.edu`,
  password: "!@#passw0rA23",
  confirmPassword: "!@#passw0rA23",
};

describe('Registration Page Tests', () => {
  beforeEach(() => {
    cy.visit('/register'); // Visit the registration page before each test
  });

  it('should display the registration form with correct elements', () => {
    // Verify the form structure
    cy.get('h2').should('contain', 'Register');
    cy.get('input[type="text"]').should('exist').should('have.attr', 'placeholder', 'Enter your Full Name');
    cy.get('input[type="email"]').should('exist').should('have.attr', 'placeholder', 'Enter your email');
    cy.get('input[type="password"]').eq(0).should('exist').should('have.attr', 'placeholder', 'Enter your password');
    cy.get('input[type="password"]').eq(1).should('exist').should('have.attr', 'placeholder', 'Confirm your password');
    cy.get('button[type="submit"]').should('contain', 'Create Account');
    cy.get('a').contains('Login').should('exist');
  });

  it('should display an error when username is too short', () => {
    cy.get('input[type="text"]').type('Be'); // Invalid username (too short)
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').eq(0).type(testUser.password);
    cy.get('input[type="password"]').eq(1).type(testUser.confirmPassword);
    cy.get('button[type="submit"]').click();

    // Verify error message
    cy.get('p#error').should('contain', 'Username should have at least 3 characters');
  });

  it('should display an error when username is too long', () => {
    cy.get('input[type="text"]').type('A'.repeat(31)); // Invalid username (too long)
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').eq(0).type(testUser.password);
    cy.get('input[type="password"]').eq(1).type(testUser.confirmPassword);
    cy.get('button[type="submit"]').click();

    // Verify error message
    cy.get('p#error').should('contain', 'Username should not exceed 30 characters');
  });

  it('should display an error for invalid email format', () => {
    cy.get('input[type="text"]').type(testUser.username);
    cy.get('input[type="email"]').type('invalid-email@gmai'); // Invalid email
    cy.get('input[type="password"]').eq(0).type(testUser.password);
    cy.get('input[type="password"]').eq(1).type(testUser.confirmPassword);
    cy.get('button[type="submit"]').click();

    // Verify error message
    cy.get('p#error').should('contain', 'Invalid email format');
  });

  it('should display an error for passwords without uppercase letters', () => {
    cy.get('input[type="text"]').type(testUser.username);
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').eq(0).type('password123'); // No uppercase letter
    cy.get('input[type="password"]').eq(1).type('password123');
    cy.get('button[type="submit"]').click();

    // Verify error message
    cy.get('p#error').should('contain', 'Password should have at least one uppercase letter');
  });

  it('should display an error for passwords without lowercase letters', () => {
    cy.get('input[type="text"]').type(testUser.username);
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').eq(0).type('PASSWORD123'); // No lowercase letter
    cy.get('input[type="password"]').eq(1).type('PASSWORD123');
    cy.get('button[type="submit"]').click();

    // Verify error message
    cy.get('p#error').should('contain', 'Password should have at least one lowercase letter');
  });

  it('should display an error for passwords without numbers', () => {
    cy.get('input[type="text"]').type(testUser.username);
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').eq(0).type('Password!@#'); // No number
    cy.get('input[type="password"]').eq(1).type('Password!@#');
    cy.get('button[type="submit"]').click();

    // Verify error message
    cy.get('p#error').should('contain', 'Password should have at least one number');
  });

  it('should display an error for short passwords', () => {
    cy.get('input[type="text"]').type(testUser.username);
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').eq(0).type('Pw1'); // Too short
    cy.get('input[type="password"]').eq(1).type('Pw1');
    cy.get('button[type="submit"]').click();

    // Verify error message
    cy.get('p#error').should('contain', 'Password should have at least 8 characters');
  });

  it('should display an error when passwords do not match', () => {
    cy.get('input[type="text"]').type(testUser.username);
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').eq(0).type(testUser.password);
    cy.get('input[type="password"]').eq(1).type('mismatchedPassword'); // Mismatched password
    cy.get('button[type="submit"]').click();

    // Verify error message
    cy.get('p#error').should('contain', 'Passwords do not match');
  });

  it('should register successfully with valid inputs', () => {
    cy.get('input[type="text"]').type(testUser.username);
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').eq(0).type(testUser.password);
    cy.get('input[type="password"]').eq(1).type(testUser.confirmPassword);
    cy.get('button[type="submit"]').click();

    // Verify success message and redirection
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Registration successful');
    });
    cy.url().should('eq', `${Cypress.config('baseUrl')}/login`);
  });

  it('should redirect to login page when clicking "Login"', () => {
    cy.get('a').contains('Login').click();

    // Verify redirection
    cy.url().should('eq', `${Cypress.config('baseUrl')}/login`);
  });

   // Use Cypress tasks to handle server-side code for cleanup
   after('Remove registered user', () => {
    cy.task('deleteUser', testUser.email).then((result) => {
      expect(result).to.be.true; // Ensure the user was deleted
    });
  });
});
