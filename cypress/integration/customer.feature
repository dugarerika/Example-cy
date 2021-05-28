@Customer
Feature: Create new custumer
    Scenario Outline: reate new custumer
        Given the main page vendor
        When sing in vendor with <userName> <password>
        When create new custumer

        Examples:
            | userName  | password    |
            | testsalon | testsalon1o |
