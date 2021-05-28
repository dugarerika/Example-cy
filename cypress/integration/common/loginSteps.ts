import {
	Given,
	When,
	Then,
	Before
} from 'cypress-cucumber-preprocessor/steps';

import login from '../pages/LoginMainPage';

Before(() => {
	cy.fixture('example.json').as('testData');
	cy.fixture('customer.json').as('testDataCustomer');
});

Given(/^the main page vendor$/, () => {
	login.visit();
});

When(
	/^sing in vendor with (.+) (.+)$/,
	(userName: string, password: string) => {
		login.login(userName, password);
	}
);

When(/^sing in vendor$/, () => {
	cy.get('@testData').then((testData: any) => {
		login.login(testData.name, testData.password);
	});
});

Then(/^validate page after sing in$/, () => {
	// TODO: implement step
});
