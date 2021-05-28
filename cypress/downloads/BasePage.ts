/// <reference types="Cypress" />
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/pt';
class BasePage {

    static hexToRgb(hex: string) {

        if (hex.startsWith('rgb')) {
            return hex;
        } else {
            hex = hex.substring(1, hex.length);
            let bigint = parseInt(hex, 16);
            let r = (bigint >> 16) & 255;
            let g = (bigint >> 8) & 255;
            let b = bigint & 255;
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    }

    static elementIsVisible(locator: string, timeout: number) {
        cy.get(locator, { timeout: timeout }).should('exist');
        cy.get(locator).should('be.visible');
    }

    static elementExists(locator: string, timeout: number) {

        return new Promise((resolve, reject) => {
            cy.get('body').find(locator).its('length').then($length => {

                if ($length > 0) {
                    cy.get(locator, { timeout: timeout }).should('exist');
                    resolve($length);
                } else {
                    reject();
                }

            });
        })

    }

    static waitNetworkRequests(locator: string, timeout: number, method: string, url: string, alias: string) {
        cy.get(locator).should('exist');
        cy.get(locator).click({ force: true });
        this.unregisterServiceWorkers();

        cy.intercept({
            method: method,
            url: url
        }).as(alias);

        cy.wait(`@${alias}`, { timeout: timeout }).then((xhr) => {
            assert.equal(xhr.response.statusCode, 200, url)
        });

    }

    static waitNetworkRequestsWithHeader(locator: string, timeout: number, method: string, url: string, alias: string) {
        cy.get(locator).should('exist');
        cy.get(locator).click({ force: true });
        this.unregisterServiceWorkers();

        cy.intercept({
            method: method,
            url: url,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'accept-language': 'en',
                'origin': 'https://payments-web-qa.copa.s4n.co'
            }
        }).as(alias);

        cy.wait(`@${alias}`, { timeout: timeout }).then((xhr) => {
            assert.equal(xhr.response.statusCode, 200, url)
        });

    }

    static waitNetworkRequestsTwoServices(locator: string, timeout: number, methodOne: string, urlOne: string, methodTwo: string, urlTwo: string, alias: string[]) {

        cy.intercept({
            url: urlOne,
            method: methodOne
        }).as(alias[0]);

        cy.intercept({
            url: urlTwo,
            method: methodTwo
        }).as(alias[1]);

        cy.get(locator).should('exist');
        cy.get(locator).click({ force: true });

        cy.wait(`@${alias[0]}`, { timeout: timeout }).then((xhr) => {
            assert.equal(xhr.response.statusCode, 200, urlOne)
        });

        cy.wait(`@${alias[1]}`, { timeout: timeout }).then((xhr) => {
            assert.equal(xhr.response.statusCode, 200, urlTwo)
        });
    }

    static stubNetworkRequests(locator: string, response: any, method: string, url: string, status: number) {

        cy.intercept({
            url: url,
            method: method
        })

        cy.get(locator).should('exist');
        cy.get(locator).click({ force: true });

    }

    static elementIsNotVisible(locator: string, timeout: number) {
        cy.get(locator).should('not.be.visible');
    }

    static elementIsChecked(locator: string, timeout: number) {
        cy.get(locator, { timeout: timeout }).should('exist');
        cy.get(locator).should('be.checked');
    }

    static elementIsNotChecked(locator: string, timeout: number) {
        cy.get(locator, { timeout: timeout }).should('exist');
        cy.get(locator).should('not.be.checked');
    }

    static elementIsEnabled(locator: string, timeout: number) {
        cy.get(locator, { timeout: timeout }).should('exist');
        cy.get(locator).should('not.be.disabled');
    }

    static elementIsNotEmpty(locator: string, timeout: number) {
        expect(locator).not.be.empty;
    }

    static elementContainValue(locator: string, comparableValue: string, timeout: number) {
        cy.get(locator, { timeout: timeout }).should('contain.value', comparableValue);
    }

    static checkElement(locator: string) {
        cy.get(locator).should('exist');
        cy.get(locator).check({ force: true });
    }

    static uncheckElement(locator: string) {
        cy.get(locator).should('exist');
        cy.get(locator).uncheck({ force: true });
    }

    static clickElement(locator: string) {
        cy.get(locator).should('exist');
        cy.get(locator).click({ force: true });

    }

    static hoverElement(locator: string) {
        cy.get(locator).should('exist');
        cy.get(locator).scrollIntoView
        cy.get(locator).trigger('mouseenter').should('be.visible');
    }

    static makeScroll(pixels?: number) {

        if (pixels) {
            cy.scrollTo(0, pixels);
        } else {
            cy.scrollTo(0, 1000);
        }

    }

    static focusOnElementsFromList(locator: string, locators: any) {
        let element = locators[locator]
        cy.get(element).should('exist');
        cy.get(element).focus()
    }

    static focusOut(isList?: boolean) {

        if (isList) {
            // @ts-ignore
            cy.focused().blur()
        } else {
            // @ts-ignore
            cy.focused().blur()

        }

    }

    static getValidationsRawDataTable(rawDataTable: any) {
        let rawTable: [][] = rawDataTable.rawTable;
        rawTable.shift()
        return rawTable;
    }

    static compareElementText(locator: string, text: string) {
        try {
            cy.get(locator).then((element) => {
                expect(element.text()).to.equal(text);
            });
        } catch (error) {
            cy.log(error)
        }
    }

    static getValueElement(locator: string): string {
        return Cypress.$(locator).attr('value');
    }

    static getTextElement(locator: string): string {
        return Cypress.$(locator).text();
    }

    static makeCSSValidation(element: string, validation: Array<any>, CSSData: any) {
        let propertiesPath = validation[2];
        let propertiesObject: Object = CSSData[`${propertiesPath}`]

        //iterate over all validations
        for (let property in propertiesObject) {

            switch (property) {
                case 'color': {
                    cy.log('evaluating ' + property + ' in element ' + element);
                    cy.get(element).then((element) => {
                        try {
                            expect(element).to.have.css(property, this.hexToRgb(propertiesObject[property]))
                        } catch (error) {
                            // cy.log(error)
                        }
                    })
                    break;
                }
                case 'background-color': {
                    // do nothing
                    break;
                }
                case 'border-color': {
                    cy.log('evaluating ' + property + ' in element ' + element);
                    cy.get(element).then((element) => {
                        try {
                            expect(element).to.have.css(property, this.hexToRgb(propertiesObject[property]))
                        } catch (error) {
                            // cy.log(error)
                        }
                    })
                    break;
                }
                case 'font-family': {
                    // do nothing
                    break;
                }
                case 'background': {
                    // do nothing
                    break;
                }
                case 'line-height': {
                    // do nothing
                    break;
                }
                case 'letter-spacing': {
                    // do nothing
                    break;
                }
                case 'border-style': {
                    // do nothing
                    break;
                }
                case 'box-sizing': {
                    // do nothing
                    break;
                }
                default: {
                    cy.log('evaluating ' + property + ' in element ' + element);
                    cy.get(element).then((element) => {
                        try {
                            expect(element).to.have.css(property, propertiesObject[property])
                        } catch (error) {
                            // cy.log(error)
                        }
                    })
                    break;
                }
            }
        }
    }

    static makeTextValidationFromTable(element: string, validation: Array<any>, languageData: any) {
        let propertiesPathString: string = validation[2];
        let propertiesPathArray = propertiesPathString.split('.');
        let mainObject: Object = languageData[`${propertiesPathArray[0]}`]
        let property: Object = mainObject[`${propertiesPathArray[1]}`]
        //validating text
        cy.log('evaluating text ' + property + ' in element ' + element);

        //validate if text depends on some other fields
        if (String(property).endsWith('_')) {

        }
        else {
            cy.get(element).then((element) => {
                // evaluate text in element
                expect(element).to.contain(property)
            })
        }
    }

    static makeTextValidationFromValue(element: string, validationPath: string, languageData: any) {
        let propertiesPath = validationPath.split('.');
        let mainObject: Object = languageData[`${propertiesPath[0]}`]
        let property: Object = mainObject[`${propertiesPath[1]}`]

        //validating text
        cy.log('evaluating text ' + property + ' in element ' + element);

        //validate if text depends on some other fields
        if (String(property).endsWith('_')) {

        }
        else {
            cy.get(element).then((element) => {
                // evaluate text in element
                expect(element).to.contain(property)
            })
        }
    }

    static makeTextValidationFromPlaceholder(element: string, validation: Array<any>, languageData: any) {
        let propertiesPathString: string = validation[2];
        let propertiesPathArray = propertiesPathString.split('.');
        let mainObject: Object = languageData[`${propertiesPathArray[0]}`]
        let property: Object = mainObject[`${propertiesPathArray[1]}`]
        //validating text
        cy.log('evaluating text ' + property + ' in element ' + element);

        //validate if text depends on some other fields
        if (String(property).endsWith('_')) {

        }
        else {
            cy.get(element).then((element) => {
                // evaluate if placeholder property have value
                expect(element).to.have.attr('placeholder').equal(property)

            })
        }
    }

    static makeCSSAndLanguageValidations(rawDataTable: any, generalLayoutCSSData: any, languageData: any, locators: any) {
        let validationRaws: [][] = this.getValidationsRawDataTable(rawDataTable);
        let validation = new Array(2);
        let element: string;

        for (validation of validationRaws) {
            element = locators[`${validation[0]}`]

            if (validation[1] == 'CSS') {
                this.makeCSSValidation(element, validation, generalLayoutCSSData);
            }

            if (validation[1] == 'TEXT') {

                if (validation[2].includes('Placeholder')) {
                    this.makeTextValidationFromPlaceholder(element, validation, languageData);
                }
                else {
                    this.makeTextValidationFromTable(element, validation, languageData);
                }

            }

        }

    }

    static elementHasPlaceholder(locator: string, timeout: number) {
        cy.get(locator, { timeout: timeout }).should('exist');
        cy.get(locator).should('have.attr', 'placeholder');
    }

    static populateFields(rawDataTable: any, locators: object) {
        // column 0 = description, column 1 = dataValidation, column 2 = field
        let dataTable: [][] = this.getValidationsRawDataTable(rawDataTable);
        let raw = new Array(2);
        let element: any;

        for (raw of dataTable) {
            element = locators[raw[2]];
            cy.get(element).type(raw[1]);
        }
    }

    static typeOnInputField(inputData: any, element: string) {

        if (!inputData) {
            cy.get(element).click();
        } else {
            cy.get(element).should('exist');
            cy.get(element).type(inputData);
        }

    }

    static typeOnAnyField(inputData: any, field: string, locators: object) {

        let element: any;
        element = locators[field];
        cy.get(element).should('exist');
        cy.get(element).type(inputData);

    }

    static selectElementsFromLists(rawDataTable: any, locators: object, languageData?: any) {
        // column 0 = description, column 1 = dataValidation, column 2 = field
        let dataTable: [][] = this.getValidationsRawDataTable(rawDataTable);
        let raw = new Array(2);
        let parentElement: string;
        let childElement: string;

        for (raw of dataTable) {
            cy.log(raw.toString())
            parentElement = locators[raw[2]];
            cy.log(parentElement)
            childElement = raw[1];

            if (childElement.includes('.')) {

                let pathArray = childElement.split('.');
                let ObjectKey: Object = languageData[pathArray[0]];
                let Objectvalue = ObjectKey[pathArray[1]];
                childElement = Objectvalue;
            }

            cy.get(parentElement).click({ force: true });
            cy.get('li').contains(childElement).click({ force: true });
        }
    }
    /* static selectElementsFromLists(rawDataTable: any, locators: object) {
         // column 0 = description, column 1 = dataValidation, column 2 = field
         let dataTable: [][] = this.getValidationsRawDataTable(rawDataTable);
         let raw = new Array(2);
         let parentElement: string;
         let childElement: string;
 
         for (raw of dataTable) {
             parentElement = locators[`${raw[2]}`]
             childElement = raw[1];
             cy.get(parentElement).click({ force: true });
             cy.get('li').contains(childElement).click({ force: true });
         }
     }*/

    static selectElementFromList(childElement: string, parentElement: string) {
        cy.get(parentElement).click({ force: true });
        cy.get('li').contains(childElement).click({ force: true });
    }

    static validateRedirectFromLanguageFile(languageData: { [x: string]: Object; }, mainObjectKey: string, propertyKey: string, element: string) {
        let mainObject: Object = languageData[mainObjectKey]
        let property: Object = mainObject[propertyKey]
        cy.get(element).should('have.attr', 'target', '_blank')
        cy.get(element).should('have.attr', 'href', property)
    }

    static validateRedirectFromLanguageFileGeneric(languageData: any, validationPath: string, element: string) {
        let propertiesPath = validationPath.split('.');
        let mainObject: Object = languageData[`${propertiesPath[0]}`]
        let property: Object = mainObject[`${propertiesPath[1]}`]
        cy.get(element).should('have.attr', 'target', '_blank')
        cy.get(element).should('have.attr', 'href', property)
    }

    static getPropertyLanguaje(languageData: any, validationPath: string): string {
        let propertiesPath: String[] = validationPath.split('.');
        let mainObject: Object = languageData[`${propertiesPath[0]}`];
        let property: string = mainObject[`${propertiesPath[1]}`];
        return property;
    }

    static dateFormat(dateInput: string, dateFormatOutput: string): string {
        let dateObj: Date = new Date(dateInput.trim());
        let momentString: string = moment.utc(dateObj, 'MM-DD-AAAA').locale(Cypress.env('language')).format(dateFormatOutput);

        if (Cypress.env('language') == 'es') {
            momentString = momentString.replace('.', "");
            momentString = momentString.replace(/^./, momentString[0].toUpperCase());
        }

        return momentString;
    }

    static dateFormatReduceDay(dateInput: string, dateFormatOutput: string, reduceDay: number): string {
        let dateObj: Date = new Date(dateInput.trim());
        let momentObj: any = moment.utc(dateObj, "MM-DD-AAAA").locale(Cypress.env('language'));
        let momentString: string = momentObj.subtract(reduceDay, 'd').format(dateFormatOutput);

        if (Cypress.env('language') == 'es') {
            momentString = momentString.replace('.', "");
            momentString = momentString.replace(/^./, momentString[0].toUpperCase());
        }

        return momentString;
    }

    static dateFormatAddDay(dateInput: string, dateFormatOutput: string, addDay: number): string {
        let dateObj: Date = new Date(dateInput.trim());
        let momentObj: any = moment.utc(dateObj, "MM-DD-AAAA").locale(Cypress.env('language'));
        let momentString: string = momentObj.add(addDay, 'd').format(dateFormatOutput);

        if (Cypress.env('language') == 'es') {
            momentString = momentString.replace('.', "");
            momentString = momentString.replace(/^./, momentString[0].toUpperCase());
        }

        return momentString;
    }

    static getRandomNumber(min: number, max: number): number {
        return Math.floor((Math.random() * (max - min)) + min);
    }

    static unregisterServiceWorkers() {

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations =>
                registrations.forEach(reg =>
                    reg.unregister(),
                ));
        }

    }

}

export default BasePage;