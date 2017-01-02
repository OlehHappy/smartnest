# SmartNest Test Automation

## Description
This document should provide basic information about testing on *Smartnest* project, what and how is being tested. How to 
setup test automation project. What is already implemented and what is planned to implement in future with indication of 
how much functionality is already covered with automated tests.
## Test Strategy
Testing is done in two steps. 

1. Manual testing of freshly release functionality to deliver new functionality as soon as possible.
2. Automated testing is used for regression testing

There is a plan to slowly get rid off step 1 and cover whole testing with automated tests which will be implemented once 
new functionality is on develop branch.

## Test Tools
### Test Automation Implementation
Tools used for test automation implementation are simple text editor (ideally some IDE as PyCharm, Sublime, etc) and 
browser. Automated tests are implemented in python (python 2.7.6) using py.test framework. 

Basics as starting browser, collecting result, etc are done using internal SalsaWebQA framework. Smartnest test automation
project depends on this framework. Test project contains only tests, page objects and support methods/functions specific 
for Smartnest project.

## Test Environments
### Local Test Environment 
Local test environment are used for manual testing and for implementation of automated tests. Local test environment is 
just OS and browser combination. VMs are used to setup local test environments for different OS and browser combinations, 
mainly for Microsoft Windows 7 - Microsoft Internet Explorer (main MS Windows combinations: Win 7 <-> IE9 - IE11) and Mac OS X combinations .
### Remote Test Environment
Browserstack is used as remote test environment. It is used mainly for running already existing automated tests; ideally 
after each commit. Automated tests are executed on latest versions (available on Browserstack) of Mozilla Firefox, Google 
Chrome and Internet Explorer on Windows 7.

## Test Project Setup
Prerequisite: Python, 

1. Setup Salsa WebQA according to https://github.com/salsita/salsa-webqa#quick-start
2. `git clone git@github.com:salsita/smartnest.git`
3. `git checkout develop` 
4. Setup project dependency: Smartnest > Salsa WebQA
5. Navigate to ../code/test/integration_tests/

Tests are located in folder ./tests. Page objects files are located in ./pages folder and support methods/functions are 
are located in ./library

## Test plans according to importance

1. Payments
2. Balance update
3. Filtering, Searching
3. Account activation - Admin, Property manager, Facility manager
4. Account activation - Renters
5. Maintenance Requests
6. Property Creations, Waitlist and Birthdays Import
