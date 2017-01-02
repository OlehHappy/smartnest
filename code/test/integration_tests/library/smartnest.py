# /usr/bin/env python
# -*- coding: utf-8 -*-
"""
@author: Vojtech Burian
@summary: Common functions to be used directly within tests.
 Written for the purpose of directly testing the system under test (may contain Asserts etc.)
"""
import datetime
import time
import os
import json

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver import ActionChains
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

from salsa_webqa.library.support.selenium_support import SeleniumTest
from salsa_webqa.library.control_test import ControlTest
from pages.renter_page import RenterDashboard
from pages.dwolla_payment_gate_page import DwollaPaymentGate
from pages.property_manager_admin_page import PropertyManagerAdmin
from pages.login_page import Login
from pages.landing_page import Landing


class SmartnestSupport():
    def __init__(self, driver):
        self.driver = driver
        self.actions = ActionChains(self.driver)
        self.renter_dashboard = RenterDashboard(self.driver)
        self.test_selenium = SeleniumTest(self.driver)
        self.dwolla = DwollaPaymentGate(self.driver)
        self.pma = PropertyManagerAdmin(self.driver)
        self.login = Login(self.driver)
        self.landing = Landing(self.driver)
        self.smartnest_control = ControlTest()

    def log_in(self, email_field_locator, email, password_field_locator, password, submit_button_locator):
        """
        Basic login function adjusted to Smartnest needs where sign in page can be displayed once application is loaded

        :param email_field_locator: email field locator
        :param email: user's email
        :param password_field_locator: password field locator
        :param password: user's password
        :param submit_button_locator: submit button locator
        """
        email_text_field = self.driver.find_element(*email_field_locator)
        email_text_field.clear()
        email_text_field.send_keys(email)
        password_text_field = self.driver.find_element(*password_field_locator)
        password_text_field.clear()
        password_text_field.send_keys(password)
        submit_button = self.driver.find_element(*submit_button_locator)
        submit_button.click()

    def log_out(self, user_link_locator, sign_out_link_locator):
        """
        Basic log out function with fallback if elements are not found
        """
        self.driver.find_element(*user_link_locator).click()

        self.driver.find_element(*sign_out_link_locator).click()

    def pay(self, pay_gate, from_account, calculated_price):
        """
        Method pays amount of money displayed on page. Payment options are set as method variables.

        For future: calculated_price might be change to three another amounts: Rent, Pre-payment and fee. Final price
        which has to be payed will be computed here in method and used for assertions

        :param pay_gate: which payment gate should be used
        :param from_account: dwolla specific paramenter indicating whether funding source for payment should be dwolla
                             balance or funds from bank account.
        :param calculated_price: Price calculated from rent amount and fee
        :return:
        """
        if pay_gate == 'dwolla':
            self.log_in(self.dwolla._dwolla_login_email_field_locator, self.dwolla._dowlla_email_input,
                        self.dwolla._dwolla_login_password_field_locator, self.dwolla._dwolla_password_input,
                        self.dwolla._dwolla_button_submit_locator)

            total_price_text = self.dwolla.dwolla_total_price.text
            total_price = total_price_text[total_price_text.find('$') + 1:]
            print total_price
            assert float(calculated_price) == float(total_price)

            funding_source_select = Select(self.dwolla.dwolla_funding_source_dropdown)
            if not from_account:
                funding_source_select.select_by_visible_text(self.dwolla.dwolla_funding_source_balance)

                self.dwolla.dwolla_pin_field.send_keys(self.dwolla.dwolla_pin)

                self.dwolla.dwolla_submit_payment_button.click()
            else:
                funding_source_select.select_by_visible_text(self.dwolla.dwolla_funding_source_from_account)

                self.dwolla.dwolla_pin_field.send_keys(self.dwolla.dwolla_pin)

                self.dwolla.dwolla_submit_payment_button.click()
        else:
            assert False, "Test failed due to using not implemented paygate"

    def payment_fees_check(self, current_value, dwolla_fee):
        """
        Method is checking whether calculated fees are correct. Method will be enhanced once new payment gates will be
        added

        :param current_value: Price from which payment fee is calculated
        :param dwolla_fee: Dwolla fee read from page
        :param paypal_fee: Pay-pal fee read from page
        :return:
        """
        assert float(dwolla_fee) == 5.00

    def is_in_payment_history_check(self, last_payment_date, last_payment_amount, last_payment_notes,
                                    last_payment_status, current_value, reversed, from_account):
        """
        Method is checking whether amount mentioned in payment history is the same as it was paid via payment gate

        :param from_account:
        :param last_payment_status:
        :param last_payment_date: Payment date i.e. today's date as payment was done few seconds/minutes before -
                                  in payment history table
        :param last_payment_amount: Amount of money paid via payment gate in payment history table
        :param last_payment_notes: Note stating how payment was done - in payment history table
        :param calculated_price: Price calculated within the test to ensure that correct amount is paid
        """
        todays_date = datetime.date.today().strftime("%B %d, %Y")

        if todays_date in last_payment_date:
            assert True
        else:
            # assert False, "There is no payment from today"
            print "no payment"

        currency_sign = "$"
        amount_with_currency = currency_sign + str("{0:.0f}".format(current_value))

        assert amount_with_currency == last_payment_amount
        assert self.renter_dashboard.payment_made_via_smartnest == last_payment_notes

        time.sleep(1)
        if from_account:
            assert last_payment_status == self.renter_dashboard.pending_payment_text
        else:
            if not reversed:
                assert last_payment_status == self.renter_dashboard.successfull_payment_text
            else:
                assert last_payment_status == self.renter_dashboard.reversed_payment_text


    def cancel_payment(self, paygate):
        if paygate == 'dwolla':
            # loading Dwolla payment gate page
            self.driver.get(self.dwolla.dwolla_sandbox_url)

            # navigating to login page
            self.dwolla.dwolla_uat_login_link.click()

            # login into Dwolla
            self.log_in(self.dwolla._dwolla_uat_login_email_field_locator, self.dwolla.dwolla_email,
                        self.dwolla._dwolla_uat_login_password_field_locator, self.dwolla.dwolla_password,
                        self.dwolla._dwolla_uat_login_login_button_locator)
            # navigating to payment details (the first one in table)
            self.dwolla.dwolla_uat_payment_details_link.click()
            # canceling payment
            self.dwolla.dwolla_uat_cancel_payment_link.click()
            cancel_status_text = self.dwolla.dwolla_uat_cancel_status.text
            # check whether there is cancel status in payment
            assert self.dwolla.dwolla_uat_cancel_status_input == cancel_status_text

            self.driver.find_element(By.LINK_TEXT, 'Log out').click()
        else:
            assert False, "Test failed due to using either incorrect or not implemented payment gate"

    def pre_payment(self, amount):
        """
        Method is setting pre-payment amount on renter dashboard.
        :param amount: Amount to be paid
        """
        # click on Make a prepayment link
        self.renter_dashboard.make_prepayment_button.click()
        # clearing out and typing in text input field
        self.renter_dashboard.pre_payment_amount_input.clear()
        self.renter_dashboard.pre_payment_amount_input.send_keys(amount)
        # taking focus out of text input field
        self.renter_dashboard.current_amount_due_dollar_sign.click()

    def extract_amount(self, fee_text):
        """
        Method extracts fee amount from text presented on page

        :param fee_text: text read from page
        :return: Fee value as float
        """
        fee = fee_text[fee_text.find('$') + 1:]

        print fee
        fee = float(fee)
        return fee

    def load_json_file(self, file_path):
        if os.path.exists(file_path):
            f = open(file_path, 'r')
            data = json.loads(f.read())
            f.close()
        else:
            data = None
        return data

    def wait_for_element_present(self, locator):
        try:
            WebDriverWait(self.driver, 10).until(lambda x: x.find_element(*locator))
        except NoSuchElementException:
            assert False, str(locator) + " was not found, failing test"

    def import_balance_updates(self, data):
        """
        Method performs full balance update. Method iterates trough all properties listed in renters_upload.json and
        upload file for each property.

        :param data: property-renters json object created out of renters_data,json
        """
        for k in range(0, len(data)):
            rental_object = data[k]
            rental_property = rental_object['property']
            print rental_property
            time.sleep(1)
            if self.test_selenium.is_element_present((By.LINK_TEXT, rental_object['property'])):
                self.driver.find_element(By.LINK_TEXT, rental_object['property']).click()
                self.pma.management_tab_link.click()
                self.pma.management_data_tab_link.click()
                self.pma.import_balance_update_button.click()
                balance_update_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, 'tests',
                                                   'data', rental_object['balance_update'])
                self.import_balance_file(balance_update_path)
            else:
                self.test_selenium.select_dropdown_value(self.pma.all_propertis_drop_down,
                                                         rental_object['property'])
                balance_update_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, 'tests',
                                                   'data', rental_object['balance_update'])
                self.import_balance_file(balance_update_path)

    def import_balance_file(self, balance_file_path):
        """
        Method uploads Balance update file. File name is taken from renters_data.json and concrete file is taken from
        folder Data

        :param balance_file_path: File path for file which is being uploaded
        """
        self.test_selenium.wait_for_element_ready(self.pma._upload_balance_choose_file_button_locator)
        self.test_selenium.upload_file(balance_file_path, self.pma._upload_balance_choose_file_button_locator)
        time.sleep(1)
        self.pma.upload_balance_updates_file_button.click()
        self.test_selenium.wait_for_element_ready(self.pma._proceed_with_update_button_locator)
        self.pma.proceed_with_update_button.click()
        self.test_selenium.wait_for_element_ready(self.pma._error_tab_link_locator)

    def navigating_to_payment_tab(self, data):
        """
        Methods navigate to payment tab for property from renters_data.json. If it is the first access of property it is clicked on link
        on List of properties otherwise property is chosen from property drop-down.

        :param data: property-renters json object created out of renters_data,json
        """
        for m in range(0, len(data)):
            rental_object = data[m]
            rental_property = rental_object['property']
            print rental_property
            time.sleep(1)
            if self.test_selenium.is_element_present((By.LINK_TEXT, rental_object['property'])):
                self.driver.find_element(By.LINK_TEXT, rental_object['property']).click()
            else:
                self.test_selenium.select_dropdown_value(self.pma.all_propertis_drop_down,
                                                         rental_object['property'])
            self.pma.payments_tab_link.click()

    def is_in_reversed_check(self, data):
        """
        Method checks whether there is reversed payment row in table on Payment > Reversed tab for payment done by
        renter from rentes_data.json

        :param data: property-renters json object created out of renters_data,json
        """
        is_in_reversed_list = list()

        for m in range(0, len(data)):
            rental_object = data[m]
            rental_property = rental_object['property']
            print rental_property
            time.sleep(1)
            if self.test_selenium.is_element_present((By.LINK_TEXT, rental_object['property'])):
                self.driver.find_element(By.LINK_TEXT, rental_object['property']).click()
            else:
                self.test_selenium.select_dropdown_value(self.pma.all_propertis_drop_down,
                                                         rental_object['property'])
            self.pma.payments_tab_link.click()
            self.pma.reversed_payment_link.click()

            renters_in_reversed = self.pma.renters_reversed_table
            renters = rental_object['renter']
            self.test_selenium.wait_for_element_ready(self.pma._export_mark_locator)

            for l in range(0, len(renters)):
                is_in_reversed_list[:] = []
                renter = renters[l]
                for renteree in range(0, len(renters_in_reversed)):
                    if renters_in_reversed[renteree].text.find(renter['name']) == -1:
                        is_in_reversed_list.append(False)
                    else:
                        is_in_reversed_list.append(True)
                in_reversed = False
                for in_list in range(0, len(is_in_reversed_list)):
                    if is_in_reversed_list[in_list]:
                        in_reversed = True
                assert in_reversed

    def is_in_normal_payment(self, data):
        """
        Method checks whether there is reversed payment row in table on Payment > Reversed tab for payment done by
        renter from rentes_data.json

        :param data: property-renters json object created out of renters_data,json
        """
        is_in_normal_payment_list = list()

        for m in range(0, len(data)):
            rental_object = data[m]
            rental_property = rental_object['property']
            print rental_property
            time.sleep(1)
            if self.test_selenium.is_element_present((By.LINK_TEXT, rental_object['property'])):
                self.driver.find_element(By.LINK_TEXT, rental_object['property']).click()
            else:
                self.test_selenium.select_dropdown_value(self.pma.all_propertis_drop_down,
                                                         rental_object['property'])
            self.pma.payments_tab_link.click()

            renters_in_normal_payment = self.pma.renters_normal_payment_table
            renters = rental_object['renter']
            self.test_selenium.wait_for_element_ready(self.pma._export_mark_locator)

            for l in range(0, len(renters)):
                is_in_normal_payment_list[:] = []
                renter = renters[l]
                for renteree in range(0, len(renters_in_normal_payment)):
                    if renters_in_normal_payment[renteree].text.find(renter['name']) == -1:
                        is_in_normal_payment_list.append(False)
                    else:
                        is_in_normal_payment_list.append(True)
                in_normal_payment = False
                for in_list in range(0, len(is_in_normal_payment_list)):
                    if is_in_normal_payment_list[in_list]:
                        in_normal_payment = True
                assert in_normal_payment

    def is_disabled(self, locator):
        element = self.driver.find_element(*locator)
        return element.is_enabled()

    def start_browser(self, driver):
        """ Browser startup function.
         Initialize session over Browserstack or local browser. """
        # get default parameter values

        browser_type = self.driver.name
        capabilities = self.smartnest_control.get_capabilities()
        browser_profile = self.smartnest_control.get_browser_profile(browser_type)

        if browser_type == "firefox":
            self.driver = webdriver.Firefox(browser_profile, capabilities=capabilities)
        elif browser_type == "chrome":
            self.driver = webdriver.Chrome(desired_capabilities=capabilities, chrome_options=browser_profile)
        elif browser_type == "ie":
            self.driver = webdriver.Ie(capabilities=capabilities)
        elif browser_type == "phantomjs":
            self.driver = webdriver.PhantomJS(desired_capabilities=capabilities)
        elif browser_type == "opera":
            self.driver = webdriver.Opera(desired_capabilities=capabilities)

        return self.driver