@login
Feature: Login into vendor
    Scenario Outline: Login into vendor
        Given the main page vendor
        When sing in vendor with <userName> <password>
        Then validate page after sing in

        Examples:
            | userName  | password    |
            | testsalon | testsalon1o |

    Scenario: Login into vendor
        Given the main page vendor
        When sing in vendor
        Then validate page after sing in