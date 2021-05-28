/// <reference types="Cypress" />

const LOCATORS = {
    USERNAME_FIELD: ':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input',
    PASSWORD_FIELD: ':nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input',
    LOGIN_BUTTON: '.styles_form__1oBzh > .MuiButton-root'
}

class LoginMainPage {
	static visit() {
		cy.visit('');
   }
   
   static login(userName: string, password: string){
        cy.get(LOCATORS.USERNAME_FIELD).type(userName);
        cy.get(LOCATORS.PASSWORD_FIELD).type(password);
        cy.get(LOCATORS.LOGIN_BUTTON).click();
    }
}

export default LoginMainPage;
