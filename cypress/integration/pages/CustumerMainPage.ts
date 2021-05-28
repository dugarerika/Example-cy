/// <reference types="Cypress" />

const LOCATORS = {
	CUSTOMER_BUTTON:
		'[href="/customers"] > .MuiButtonBase-root > .MuiListItemIcon-root > .fal',
	ADD_NEW_CUSTOMER_BUTTON:
		'.MuiGrid-container > :nth-child(2) > .MuiButtonBase-root > .MuiButton-label',
	FIRST_NAME_FIELD:
		':nth-child(1) > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input',
	LAST_NAME_FIELD:
		':nth-child(1) > :nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input',
	COUNTRY_CODE_SELECT: '.css-t4b694-control',
	COUNTRY_CODE: '#react-select-2-option-1',cy.get('.css-1uccc91-singleValue')
	NUMBER_FIELD:
		'.jss181 > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input',
	EMAIL_FIELD:
		'.jss180 > :nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input',
	BIRTHDAY_MONTH_SELECT:
		':nth-child(4) > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiSelect-root',
	BIRTHDAY_MONTH: '[data-value="March"]',
	BIRTHDAY_DAY_SELECT:
		':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiSelect-root',
	BIRTHDAY_DAY: '[data-value="5"]',
	GENDER_SELECT:
		':nth-child(6) > :nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiSelect-root',
	GENDER_FEMALE: '[data-value="F"]',
	GENDER_MALE: '[data-value="M"]',
	SUBMIT_BUTTON:
      '.MuiDialogActions-root > div > .MuiButton-contained > .MuiButton-label'
    // cy.get('.MuiPaper-root > .MuiIconButton-root')
};

class CustomerMainPage {
	static newCustumer() {
		cy.get(LOCATORS.CUSTOMER_BUTTON).click();
		cy.get(LOCATORS.ADD_NEW_CUSTOMER_BUTTON).click();
		cy
			.get('@testDataCustomer')
			.then((testDataCustomer: any) => {
				cy
					.get(LOCATORS.FIRST_NAME_FIELD)
					.type(testDataCustomer.first_name);
				cy
					.get(LOCATORS.LAST_NAME_FIELD)
					.type(testDataCustomer.last_name);
			});
		cy.get(LOCATORS.COUNTRY_CODE_SELECT).click();
		cy.get(LOCATORS.COUNTRY_CODE).click();
		cy
			.get('@testDataCustomer')
			.then((testDataCustomer: any) => {
				cy
					.get(LOCATORS.NUMBER_FIELD)
					.type(testDataCustomer.number);
				cy
					.get(LOCATORS.EMAIL_FIELD)
					.type(testDataCustomer.email);
			});
		cy.get(LOCATORS.BIRTHDAY_MONTH_SELECT).click();
		cy.get(LOCATORS.BIRTHDAY_MONTH).click();
		cy.get(LOCATORS.BIRTHDAY_DAY_SELECT).click();
		cy.get(LOCATORS.BIRTHDAY_DAY).click();
		cy.get(LOCATORS.GENDER_SELECT).click();
		cy.get(LOCATORS.GENDER_FEMALE).click();
		cy.get(LOCATORS.SUBMIT_BUTTON).click();
	}
}

export default CustomerMainPage;
