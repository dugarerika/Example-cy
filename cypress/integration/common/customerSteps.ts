import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import custumer from '../pages/CustumerMainPage'


When(/^create new custumer$/, () => {
    custumer.newCustumer();
});