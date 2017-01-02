__author__ = 'Juraj'
from selenium.webdriver.common.by import By

from pages.page_base import Page


class RenterDashboard(Page):
    """Login page object"""

    def __init__(self, driver):
        # Util_Elements.__init__(self, driver)
        self.driver = driver
        # page elements locators section
        self._current_amount_due_value_locator = (
            By.XPATH, '//div[@class="payment-amount"]/input')
        self._current_amount_due_dollar_sign_locator = (By.XPATH, '//div[@class="payment-amount"]/span[2]')
        self._make_prepayment_link_locator = (By.XPATH, '//div[@class="prepayment-button"]/button[1]')
        self._dwolla_estm_fee_locator = (By.XPATH, '//div[@class="tab-content"]/div[1]/div[1]/div[3]/div/span[1]')
        self._dwolla_payment_button_locator = (By.CSS_SELECTOR, 'button.dwolla-button')
        self._last_payment_date_text_locator = (By.XPATH, '//div[@class="tab-content"]/div[2]/table/tbody/tr[1]/td[1]')
        self._last_payment_amount_text_locator = (
        By.XPATH, '//div[@class="tab-content"]/div[2]/table/tbody/tr[1]/td[2]')
        self._last_payment_description_text_locator = (
            By.XPATH, '//div[@class="tab-content"]/div[2]/table/tbody/tr[1]/td[3]')
        self._last_payment_status_text_locator = (
            By.XPATH, '//div[@class="tab-content"]/div[2]/table/tbody/tr[1]/td[4]')
        self._payment_via_smartnest_note = "SmartNest Payment"
        self._pre_payment_amount_input_locator = (By.XPATH, '//div[@class="payment-amount"]/input')
        self._user_drop_down_link_locator = (By.CSS_SELECTOR, 'a.dropdown-toggle.ng-binding')
        self._signout_link_locator = (By.CSS_SELECTOR, 'span.glyphicon.glyphicon-log-out')
        self._payment_tab_link_locator = (By.LINK_TEXT, 'PAYMENTS')
        self._successfull_payment_status_text = "completed"
        self._reversed_payment_status_text = "reversed (Transaction cancelled by user.)"
        self._pending_payment_status_text = "pending"
        self._error_message_text_locator = (By.CSS_SELECTOR, 'p.alert.alert-danger.ng-binding')
        self._payment_amount_text_locator = (By.XPATH, '//div[@class="payment-amount"]/span[1]')

        self._error_message_content = "Please Note: You can not make a payment for less than your current outstanding balance of "

    @property
    def current_amount_due_value_css(self):
        return self.driver.find_element(*self._current_amount_due_value_locator)

    @property
    def make_prepayment_button(self):
        return self.driver.find_element(*self._make_prepayment_link_locator)

    @property
    def dwolla_estimated_fee(self):
        return self.driver.find_element(*self._dwolla_estm_fee_locator)

    @property
    def last_payment_date(self):
        return self.driver.find_element(*self._last_payment_date_text_locator)

    @property
    def last_payment_amount(self):
        return self.driver.find_element(*self._last_payment_amount_text_locator)

    @property
    def last_payment_description(self):
        return self.driver.find_element(*self._last_payment_description_text_locator)

    @property
    def last_payment_status(self):
        return self.driver.find_element(*self._last_payment_status_text_locator)

    @property
    def payment_made_via_smartnest(self):
        return self._payment_via_smartnest_note

    @property
    def pre_payment_amount_input(self):
        return self.driver.find_element(*self._pre_payment_amount_input_locator)

    @property
    def current_amount_due_dollar_sign(self):
        return self.driver.find_element(*self._current_amount_due_dollar_sign_locator)

    @property
    def user_drop_down_link(self):
        return self.driver.find_element(*self._user_drop_down_link_locator)

    @property
    def signout_link(self):
        return self.driver.find_element(*self._signout_link_locator)

    @property
    def dwolla_payment_button(self):
        return self.driver.find_element(*self._dwolla_payment_button_locator)

    @property
    def payment_tab_link(self):
        return self.driver.find_element(*self._payment_tab_link_locator)

    @property
    def successfull_payment_text(self):
        return self._successfull_payment_status_text

    @property
    def reversed_payment_text(self):
        return self._reversed_payment_status_text

    @property
    def pending_payment_text(self):
        return self._pending_payment_status_text

    @property
    def error_message_text(self):
        return self.driver.find_element(*self._error_message_text_locator)

    @property
    def error_message_content(self):
        return self._error_message_content