/// <reference types="Cypress" />

class BasePage {
	static elementExists(locator: string, timeout: number) {
		return new Promise((resolve, reject) => {
			cy
				.get('body')
				.find(locator)
				.its('length')
				.then(($length) => {
					if ($length > 0) {
						cy
							.get(locator, { timeout: timeout })
							.should('exist');
						resolve($length);
					}
					else {
						reject();
					}
				});
		});
	}
}

export default BasePage;
