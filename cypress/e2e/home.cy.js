/// <reference types="cypress" />

describe('Visit Home Page', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should display the home page', () => {
        cy.get('h1').should('contain', 'Welcome to Our Website');
        cy.get('nav').should('exist');
        cy.get('footer').should('exist');
    });

    it('should navigate to the about page', () => {
        cy.get('nav a[href="/about"]').click();
        cy.url().should('include', '/about');
        cy.get('h1').should('contain', 'About Us');
    });
});
