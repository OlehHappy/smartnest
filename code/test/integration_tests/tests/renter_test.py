__author__ = 'Juraj'

from salsa_webqa.library.control_test import ControlTest
from pages.landing_page import Landing
from pages.login_page import Login
from pages.header_page import Header
from pages.property_list_page import Property_List
from pages.renter_page import RenterDashboard
from pages.dwolla_payment_gate_page import DwollaPaymentGate
from pages.property_manager_admin_page import PropertyManagerAdmin
from tests.conftest import get_test_info
from library.smartnest import SmartnestSupport
from salsa_webqa.library.support.selenium_support import SeleniumTest



# noinspection PyProtectedMember
class TestInvitation():
    def setup_class(self):
        self.smartnest_control = ControlTest()
        self.driver = self.smartnest_control.start_browser()
        self.driver.maximize_window()
        self.landing = Landing(self.driver)
        self.login = Login(self.driver)
        self.renter_dashboard = RenterDashboard(self.driver)
        self.header = Header(self.driver)
        self.property_list = Property_List(self.driver)
        self.smartnest = SmartnestSupport(self.driver)
        self.dwolla = DwollaPaymentGate(self.driver)
        self.test_selenium = SeleniumTest(self.driver)
        self.pma = PropertyManagerAdmin(self.driver)

    def teardown_class(self):
        self.smartnest_control.stop_browser()

    def setup_method(self, method):
        print "spustena setup-method"
        self.smartnest_control.start_test()

    def teardown_method(self, method):
        """ executes after test function finishes """
        print "spustena tier-down-method"
        test_info = get_test_info()
        self.smartnest_control.stop_test(test_info)

    # def test_payment_balance_dwolla(self):
    #     """
    #     Test is checking whether it is possible to pay rent via Dwolla Balance and whether renter's and admin's history
    #     item for particular payemnt is correct.
    #     Prerequisite: Import balance updates for renters in renters_data.json
    #     1. Load application
    #     2. Log into application
    #     3. Pay via Dwolla Balance
    #     4. Check in Renter's history
    #     5. Check in Admin's history
    #     """
    #
    #     data = self.smartnest.load_json_file(
    #         os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, 'tests', 'data',
    #                      'renters_data.json'))
    #     time.sleep(1)
    #     if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #         self.landing.sign_in_landing_link.click()
    #     time.sleep(1)
    #     self.smartnest.log_in(self.login._emialTextField_locator, self.pma.pma_login,
    #                           self.login._passwordTextField_locator, self.pma.pma_password,
    #                           self.login._signInButton_locator)
    #     time.sleep(1)
    #     self.smartnest.import_balance_updates(data)
    #     self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                            self.renter_dashboard._signout_link_locator)
    #
    #     for i in range(0, len(data)):
    #         rental_object = data[i]
    #         rental_property = rental_object['property']
    #         renters = rental_object['renter']
    #         for j in range(0, len(renters)):
    #             renter = renters[j]
    #             time.sleep(1)
    #             if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #                 self.landing.sign_in_landing_link.click()
    #             time.sleep(1)
    #             # 1. step: login into application with fees check
    #             self.smartnest.log_in(self.login._emialTextField_locator, renter['email'],
    #                                   self.login._passwordTextField_locator, renter['password'],
    #                                   self.login._signInButton_locator)
    #             time.sleep(3)
    #             # reading estimated fees from page
    #             dwolla_text_fee = self.driver.find_element(*self.renter_dashboard._dwolla_estm_fee_locator).text
    #             current_amount_text = self.driver.find_element(
    #                 *self.renter_dashboard._payment_amount_text_locator).text
    #             dwolla_fee = self.smartnest.extract_amount(dwolla_text_fee)
    #             current_value = self.smartnest.extract_amount(current_amount_text)
    #             # remembering balance value for later check in Admin's pay,ents
    #             renter['balance'] = current_value
    #             self.smartnest.payment_fees_check(current_value, dwolla_fee)
    #             time.sleep(2)
    #             # 2. Paying the rent from balance
    #             self.renter_dashboard.dwolla_payment_button.click()
    #             time.sleep(2)
    #
    #             price_from_dwolla_text = self.dwolla.dwolla_price_being_paid.text
    #             price_from_dwolla = self.smartnest.extract_amount(price_from_dwolla_text)
    #             calculated_price = float(dwolla_fee) + float(current_value)
    #
    #             assert float(calculated_price) == float(price_from_dwolla)
    #
    #             self.smartnest.pay("dwolla", False, calculated_price)
    #             time.sleep(2)
    #
    #             # click on Payment tab link
    #             self.renter_dashboard.payment_tab_link.click()
    #
    #             last_payment_date = self.renter_dashboard.last_payment_date.text
    #             last_payment_amount = self.renter_dashboard.last_payment_amount.text
    #             last_payment_description = self.renter_dashboard.last_payment_description.text
    #             last_payment_status = self.renter_dashboard.last_payment_status.text
    #
    #             self.smartnest.is_in_payment_history_check(last_payment_date, last_payment_amount,
    #                                                        last_payment_description, last_payment_status,
    #                                                        current_value,
    #                                                        False, False)
    #             # logging out from application as preparation for next test step
    #             self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                                    self.renter_dashboard._signout_link_locator)
    #
    #     time.sleep(1)
    #     if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #         self.landing.sign_in_landing_link.click()
    #
    #     time.sleep(1)
    #     self.smartnest.log_in(self.login._emialTextField_locator, self.pma.pma_login,
    #                           self.login._passwordTextField_locator, self.pma.pma_password,
    #                           self.login._signInButton_locator)
    #
    #     self.smartnest.is_in_normal_payment(data)
    #
    #     self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                            self.renter_dashboard._signout_link_locator)
    #
    # def test_payment_from_account(self):
    #     """
    #     Test is checking whether it is possible to pay rent via Dwolla Bank account and whether renter's and admin's history
    #     item for particular payemnt is correct.
    #     Prerequisite: Import balance updates for renters in renters_data.json
    #     1. Load application
    #     2. Log into application
    #     3. Pay via Dwolla Bank account
    #     4. Check in Renter's history
    #     5. Check in Admin's history
    #     """
    #     data = self.smartnest.load_json_file(
    #         os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, 'tests', 'data',
    #                      'renters_data.json'))
    #     time.sleep(1)
    #     if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #         self.landing.sign_in_landing_link.click()
    #     time.sleep(1)
    #     self.smartnest.log_in(self.login._emialTextField_locator, self.pma.pma_login,
    #                           self.login._passwordTextField_locator, self.pma.pma_password,
    #                           self.login._signInButton_locator)
    #     time.sleep(1)
    #     self.smartnest.import_balance_updates(data)
    #     self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                            self.renter_dashboard._signout_link_locator)
    #
    #     for i in range(0, len(data)):
    #         rental_object = data[i]
    #         rental_property = rental_object['property']
    #         renters = rental_object['renter']
    #         for j in range(0, len(renters)):
    #             renter = renters[j]
    #             time.sleep(1)
    #             if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #                 self.landing.sign_in_landing_link.click()
    #             time.sleep(1)
    #             # 1. step: login into application with fees check
    #             self.smartnest.log_in(self.login._emialTextField_locator, renter['email'],
    #                                   self.login._passwordTextField_locator, renter['password'],
    #                                   self.login._signInButton_locator)
    #             time.sleep(3)
    #             # reading estimated fees from page
    #
    #             dwolla_text_fee = self.driver.find_element(*self.renter_dashboard._dwolla_estm_fee_locator).text
    #             current_amount_text = self.driver.find_element(
    #                 *self.renter_dashboard._payment_amount_text_locator).text
    #             dwolla_fee = self.smartnest.extract_amount(dwolla_text_fee)
    #             current_value = self.smartnest.extract_amount(current_amount_text)
    #             # remembering balance value for later check in Admin's pay,ents
    #             renter['balance'] = current_value
    #             self.smartnest.payment_fees_check(current_value, dwolla_fee)
    #             time.sleep(2)
    #             # 2. Paying the rent from balance
    #             self.renter_dashboard.dwolla_payment_button.click()
    #             time.sleep(2)
    #
    #             price_from_dwolla_text = self.dwolla.dwolla_price_being_paid.text
    #             price_from_dwolla = self.smartnest.extract_amount(price_from_dwolla_text)
    #             calculated_price = float(dwolla_fee) + float(current_value)
    #
    #             assert float(calculated_price) == float(price_from_dwolla)
    #
    #             self.smartnest.pay("dwolla", True, calculated_price)
    #             time.sleep(2)
    #
    #             # click on Payment tab link
    #             self.renter_dashboard.payment_tab_link.click()
    #
    #             last_payment_date = self.renter_dashboard.last_payment_date.text
    #             last_payment_amount = self.renter_dashboard.last_payment_amount.text
    #             last_payment_description = self.renter_dashboard.last_payment_description.text
    #             last_payment_status = self.renter_dashboard.last_payment_status.text
    #
    #             self.smartnest.is_in_payment_history_check(last_payment_date, last_payment_amount,
    #                                                        last_payment_description, last_payment_status, current_value,
    #                                                        False, True)
    #             # logging out from application as preparation for next test step
    #             self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                                    self.renter_dashboard._signout_link_locator)
    #     time.sleep(1)
    #     if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #         self.landing.sign_in_landing_link.click()
    #
    #     time.sleep(1)
    #     self.smartnest.log_in(self.login._emialTextField_locator, self.pma.pma_login,
    #                           self.login._passwordTextField_locator, self.pma.pma_password,
    #                           self.login._signInButton_locator)
    #
    #     self.smartnest.is_in_normal_payment(data)
    #
    #     self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                            self.renter_dashboard._signout_link_locator)
    #
    # def test_payment_prepayment_complete(self):
    #     """
    #     Test is checking whether it is possible to pre-pay rent; test performs full circle:
    #     1. Renter pre-payment set
    #     2. Payment via Dwolla
    #     3. Check in Renter's payment history
    #     4. Check in Admin's payment history
    #     """
    #     data = self.smartnest.load_json_file(
    #         os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, 'tests', 'data',
    #                      'renters_data.json'))
    #     time.sleep(1)
    #     if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #         self.landing.sign_in_landing_link.click()
    #     time.sleep(1)
    #
    #     for i in range(0, len(data)):
    #         print i
    #         # print data[i]
    #         rental_object = data[i]
    #         rental_property = rental_object['property']
    #         renters = rental_object['renter']
    #         for j in range(0, len(renters)):
    #             renter = renters[j]
    #
    #             # finish adujustments - in login, saving name and balance value to dictionary for control
    #             # 1. step: login into application with fees check
    #             time.sleep(1)
    #             if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #                 self.landing.sign_in_landing_link.click()
    #             time.sleep(1)
    #             self.smartnest.log_in(self.login._emialTextField_locator, renter['email'],
    #                                   self.login._passwordTextField_locator, renter['password'],
    #                                   self.login._signInButton_locator)
    #             time.sleep(1)
    #             self.smartnest.pre_payment(renter['prepayment'])
    #             # reading estimated fees from page
    #             time.sleep(1)
    #             dwolla_text_fee = self.driver.find_element(*self.renter_dashboard._dwolla_estm_fee_locator).text
    #             print dwolla_text_fee
    #             current_amount_text = self.driver.find_element(
    #                 *self.renter_dashboard._current_amount_due_value_locator).get_attribute('value')
    #
    #             dwolla_fee = self.smartnest.extract_amount(dwolla_text_fee)
    #             current_value = self.smartnest.extract_amount(current_amount_text)
    #             # remembering balance value for later check in Admin's pay,ents
    #             renter['balance'] = current_value
    #
    #             self.smartnest.payment_fees_check(current_value, dwolla_fee)
    #             time.sleep(1)
    #             # 2. Paying the rent from balance
    #
    #             self.renter_dashboard.dwolla_payment_button.click()
    #
    #             price_from_dwolla_text = self.dwolla.dwolla_price_being_paid.text
    #             price_from_dwolla = self.smartnest.extract_amount(price_from_dwolla_text)
    #             calculated_price = float(dwolla_fee) + float(current_value)
    #
    #             assert float(calculated_price) == float(price_from_dwolla)
    #
    #             self.smartnest.pay("dwolla", False, calculated_price)
    #             time.sleep(2)
    #
    #             # click on Payment tab link
    #             self.renter_dashboard.payment_tab_link.click()
    #             last_payment_date = self.renter_dashboard.last_payment_date.text
    #             last_payment_amount = self.renter_dashboard.last_payment_amount.text
    #             last_payment_description = self.renter_dashboard.last_payment_description.text
    #             last_payment_status = self.renter_dashboard.last_payment_status.text
    #
    #             print last_payment_amount
    #
    #             self.smartnest.is_in_payment_history_check(last_payment_date, last_payment_amount,
    #                                                        last_payment_description,
    #                                                        last_payment_status, current_value,
    #                                                        False, False)
    #
    #             assert self.smartnest.extract_amount(last_payment_amount) == current_value
    #
    #             # logging out from application as preparation for next test step
    #             self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                                    self.renter_dashboard._signout_link_locator)
    #     time.sleep(1)
    #     if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #         self.landing.sign_in_landing_link.click()
    #
    #     time.sleep(1)
    #     self.smartnest.log_in(self.login._emialTextField_locator, self.pma.pma_login,
    #                           self.login._passwordTextField_locator, self.pma.pma_password,
    #                           self.login._signInButton_locator)
    #
    #     self.smartnest.is_in_normal_payment(data)
    #
    #     self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                            self.renter_dashboard._signout_link_locator)
    #
    # def test_payment_prepayment_less_than_balance(self):
    #     """
    #     Test is checking whether it is impossible to make a prepayment less then balance
    #     1. Renter pre-payment set
    #     2. Check whether error message appears and whether payment buttons are disabled
    #     """
    #     data = self.smartnest.load_json_file(
    #         os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, 'tests', 'data',
    #                      'renters_data.json'))
    #     time.sleep(1)
    #     if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #         self.landing.sign_in_landing_link.click()
    #     time.sleep(1)
    #     self.smartnest.log_in(self.login._emialTextField_locator, self.pma.pma_login,
    #                           self.login._passwordTextField_locator, self.pma.pma_password,
    #                           self.login._signInButton_locator)
    #
    #     self.smartnest.import_balance_updates(data)
    #
    #     self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                            self.renter_dashboard._signout_link_locator)
    #
    #     for i in range(0, len(data)):
    #         rental_object = data[i]
    #         rental_property = rental_object['property']
    #         renters = rental_object['renter']
    #         for j in range(0, len(renters)):
    #             renter = renters[j]
    #
    #             # finish adujustments - in login, saving name and balance value to dictionary for control
    #             # 1. step: login into application with fees check
    #             time.sleep(1)
    #             if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #                 self.landing.sign_in_landing_link.click()
    #             time.sleep(1)
    #             self.smartnest.log_in(self.login._emialTextField_locator, renter['email'],
    #                                   self.login._passwordTextField_locator, renter['password'],
    #                                   self.login._signInButton_locator)
    #             time.sleep(1)
    #             current_amount_text = self.driver.find_element(
    #                 *self.renter_dashboard._payment_amount_text_locator).text
    #
    #             self.smartnest.pre_payment(renter['prepayment2'])
    #             time.sleep(1)
    #             # 2. step: Check whether payment buttons are disabled and error message is displayed with correct wording
    #             payment_button_disabled = self.smartnest.is_disabled(
    #                 self.renter_dashboard._dwolla_payment_button_locator)
    #
    #             if not payment_button_disabled:
    #                 assert True
    #             else:
    #                 assert False
    #             created_error_message = self.renter_dashboard.error_message_content + current_amount_text + "."
    #             error_message_from_page = self.renter_dashboard.error_message_text.text
    #
    #             assert created_error_message == error_message_from_page
    #
    #             self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                                    self.renter_dashboard._signout_link_locator)
    #
    # def test_payment_cancel_payment(self):
    #     """
    #     Test is checking whether if payment is cancelled, it is reflected on renter's dashboard, renter's and admin's
    #     payment history.
    #     Steps:
    #     Prerequisite: Import balance updates for renters in renters_data.json
    #     1. Load application
    #     2. Log into application
    #     3. Perform payment via Dwolla bank account
    #     4. Cancel payment
    #     5. Check whether payment is reversed on Renter's payment history
    #     6. Check whether payment is reversed on Admin's payment history
    #     """
    #     data = self.smartnest.load_json_file(
    #         os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, 'tests', 'data',
    #                      'renters_data.json'))
    #
    #     time.sleep(1)
    #     if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #         self.landing.sign_in_landing_link.click()
    #
    #     self.smartnest.log_in(self.login._emialTextField_locator, self.pma.pma_login,
    #                           self.login._passwordTextField_locator, self.pma.pma_password,
    #                           self.login._signInButton_locator)
    #     time.sleep(1)
    #     self.smartnest.import_balance_updates(data)
    #     self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                            self.renter_dashboard._signout_link_locator)
    #
    #     for i in range(0, len(data)):
    #         rental_object = data[i]
    #         rental_property = rental_object['property']
    #         renters = rental_object['renter']
    #         for j in range(0, len(renters)):
    #             renter = renters[j]
    #
    #             time.sleep(1)
    #             if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #                 self.landing.sign_in_landing_link.click()
    #             time.sleep(1)
    #             # 1. step: login into application with fees check
    #             self.smartnest.log_in(self.login._emialTextField_locator, renter['email'],
    #                                   self.login._passwordTextField_locator, renter['password'],
    #                                   self.login._signInButton_locator)
    #             time.sleep(3)
    #             # reading estimated fees from page
    #
    #             dwolla_text_fee = self.driver.find_element(*self.renter_dashboard._dwolla_estm_fee_locator).text
    #             current_amount_text = self.driver.find_element(
    #                 *self.renter_dashboard._current_amount_due_value_locator).text
    #
    #             dwolla_fee = self.smartnest.extract_amount(dwolla_text_fee)
    #             current_value = self.smartnest.extract_amount(current_amount_text)
    #             # remembering balance value for later check in Admin's payments
    #             renter['balance'] = current_value
    #
    #             self.smartnest.payment_fees_check(current_value, dwolla_fee)
    #             time.sleep(2)
    #             # 2. Paying the rent from balance
    #             self.renter_dashboard.dwolla_payment_button.click()
    #             time.sleep(2)
    #
    #             price_from_dwolla_text = self.dwolla.dwolla_price_being_paid.text
    #             price_from_dwolla = self.smartnest.extract_amount(price_from_dwolla_text)
    #             calculated_price = float(dwolla_fee) + float(current_value)
    #
    #             assert float(calculated_price) == float(price_from_dwolla)
    #
    #             self.smartnest.pay("dwolla", True, calculated_price)
    #             time.sleep(2)
    #
    #             self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                                    self.renter_dashboard._signout_link_locator)
    #
    #             self.smartnest.cancel_payment("dwolla")
    #             # click on Payment tab link
    #
    #             self.driver.get(self.smartnest_control.gid('base_url'))
    #
    #             if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #                 self.landing.sign_in_landing_link.click()
    #             time.sleep(1)
    #             # 1. step: login into application with fees check
    #             self.smartnest.log_in(self.login._emialTextField_locator, renter['email'],
    #                                   self.login._passwordTextField_locator, renter['password'],
    #                                   self.login._signInButton_locator)
    #             time.sleep(2)
    #
    #             assert self.smartnest.extract_amount(
    #                 self.driver.find_element(*self.renter_dashboard._current_amount_due_value_locator).text) == renter[
    #                        'balance']
    #             self.renter_dashboard.payment_tab_link.click()
    #
    #             last_payment_date = self.renter_dashboard.last_payment_date.text
    #             last_payment_amount = self.renter_dashboard.last_payment_amount.text
    #             last_payment_description = self.renter_dashboard.last_payment_description.text
    #             last_payment_status = self.renter_dashboard.last_payment_status.text
    #
    #             self.smartnest.is_in_payment_history_check(last_payment_date, last_payment_amount,
    #                                                        last_payment_description, last_payment_status, current_value,
    #                                                        True, False)
    #             # logging out from application as preparation for next test step
    #             self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                                    self.renter_dashboard._signout_link_locator)
    #
    #     if not self.test_selenium.is_element_present(self.login._signInButton_locator):
    #         self.landing.sign_in_landing_link.click()
    #     time.sleep(1)
    #
    #     self.smartnest.log_in(self.login._emialTextField_locator, self.pma.pma_login,
    #                           self.login._passwordTextField_locator, self.pma.pma_password,
    #                           self.login._signInButton_locator)
    #     time.sleep(1)
    #     self.smartnest.is_in_reversed_check(data)
    #
    #     self.smartnest.log_out(self.renter_dashboard._user_drop_down_link_locator,
    #                            self.renter_dashboard._signout_link_locator)
