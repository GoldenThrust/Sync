/// <reference types="cypress" />

describe('Signup Page', () => {
    beforeEach(() => {
        cy.visit('/signup');
    });

    it('should display the signup form', () => {
        cy.get('form').should('exist');
        cy.get('input[name="username"]').should('exist');
        cy.get('input[name="email"]').should('exist');
        cy.get('input[name="password"]').should('exist');
        cy.get('button[type="submit"]').should('exist');
    });

    it('should allow a user to sign up with valid credentials', () => {
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="email"]').type('testuser@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
    });
    it('should show an error message for invalid email', () => {
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="email"]').type('invalid-email');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
        cy.get('.error-message').should('contain', 'Please enter a valid email address');
    });

    it('should show an error message for weak password', () => {
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="email"]').type('testuser@example.com');
        cy.get('input[name="password"]').type('123');
        cy.get('button[type="submit"]').click();
        cy.get('.error-message').should('contain', 'Password must be at least 6 characters long');
    });
    it('should show an error message for missing fields', () => {
        cy.get('button[type="submit"]').click();
        cy.get('.error-message').should('contain', 'All fields are required');
    });

    it('should redirect to the login page after successful signup', () => {
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="email"]').type('testuser@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
    });

});