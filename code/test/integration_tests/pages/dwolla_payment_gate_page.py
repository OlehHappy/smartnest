__author__ = 'juraj'
from selenium.webdriver.common.by import By

from pages.page_base import Page


class DwollaPaymentGate(Page):
    def __init__(self, driver):
        # Util_Elements.__init__(self, driver)
        self.driver = driver
        self._dwolla_login_email_field_locator = (By.ID, 'email')
        self._dwolla_login_password_field_locator = (By.ID, 'password')
        self._dowlla_email_input = 'juraj@mysmartnest.com'
        self._dwolla_password_input = 'Dwolla123'
        self._dwolla_button_submit_locator = (By.CSS_SELECTOR, 'button.btn--submit')
        self._dwolla_funding_source_dropdown_locator = (By.ID, 'FundingSource')
        self._dwolla_funding_source_balance_visible_text = 'My Dwolla Balance'
        self._dwolla_funding_source_from_bank_account_visible_text = 'First Midwestern Bank - XXX6789'
        self._dwolla_pin_field_locator = (By.ID, 'Pin')
        self._dwolla_pin_input = '1234'
        self._dwolla_price_being_paid_locator = (By.CLASS_NAME, 'merchant-header__amount')
        self._dwolla_total_price_locator = (By.CLASS_NAME, 'checkout-summary__amt--total')
        self._dwolla_submit_payment_button_locator = (By.ID, 'btn-place-order')
        self._dwolla_sandbox_url_input = "https://uat.dwolla.com"
        self._dwolla_uat_login_link_locator = (By.LINK_TEXT, "Log in")
        self._dwolla_uat_login_email_field_locator = (By.ID, "email")
        self._dwolla_uat_login_password_field_locator = (By.ID, "Password")
        self._dwolla_uat_login_login_button_locator = (By.ID, "Submit")
        self._dwolla_uat_payment_details_link_locator = (
            By.XPATH, '//table[@class="table-transactions"]/tbody/tr[1]/td[5]/a')
        self._dwolla_uat_cancel_payment_link_locator = (By.LINK_TEXT, "Cancel this transfer")
        self._dwolla_uat_cancel_status_text_locator = (By.XPATH, '//*[@id="moneyin"]/div[2]/div/ul/li[5]/span')
        self._dwolla_uat_cancel_status_text_input = "Deposit was cancelled. Contact Dwolla for more information"


    @property
    def dwolla_email_address(self):
        return self.driver.find_element(*self._dwolla_login_email_field_locator)

    @property
    def dwolla_password(self):
        return self.driver.find_element(*self._dwolla_login_password_field_locator)

    @property
    def dwolla_email(self):
        return self._dowlla_email_input

    @property
    def dwolla_password(self):
        return self._dwolla_password_input

    @property
    def dwolla_submit_button(self):
        return self.driver.find_element(*self._dwolla_button_submit_locator)

    @property
    def dwolla_funding_source_dropdown(self):
        return self.driver.find_element(*self._dwolla_funding_source_dropdown_locator)

    @property
    def dwolla_funding_source_balance(self):
        return self._dwolla_funding_source_balance_visible_text

    @property
    def dwolla_funding_source_from_account(self):
        return self._dwolla_funding_source_from_bank_account_visible_text

    @property
    def dwolla_pin_field(self):
        return self.driver.find_element(*self._dwolla_pin_field_locator)

    @property
    def dwolla_pin(self):
        return self._dwolla_pin_input

    @property
    def dwolla_price_being_paid(self):
        return self.driver.find_element(*self._dwolla_price_being_paid_locator)

    @property
    def dwolla_total_price(self):
        return self.driver.find_element(*self._dwolla_total_price_locator)

    @property
    def dwolla_submit_payment_button(self):
        return self.driver.find_element(*self._dwolla_submit_payment_button_locator)

    @property
    def dwolla_sandbox_url(self):
        return self._dwolla_sandbox_url_input

    @property
    def dwolla_uat_login_link(self):
        return self.driver.find_element(*self._dwolla_uat_login_link_locator)

    @property
    def dwolla_uat_login_email_field(self):
        return self.driver.find_element(*self._dwolla_uat_login_email_field_locator)

    @property
    def dwolla_uat_login_password_field(self):
        return self.driver.find_element(*self._dwolla_uat_login_password_field_locator)

    @property
    def dwolla_uat_login_button(self):
        return self.driver.find_element(*self._dwolla_uat_login_login_button_locator)

    @property
    def dwolla_uat_payment_details_link(self):
        return self.driver.find_element(*self._dwolla_uat_payment_details_link_locator)

    @property
    def dwolla_uat_cancel_payment_link(self):
        return self.driver.find_element(*self._dwolla_uat_cancel_payment_link_locator)

    @property
    def dwolla_uat_cancel_status(self):
        return self.driver.find_element(*self._dwolla_uat_cancel_status_text_locator)

    @property
    def dwolla_uat_cancel_status_input(self):
        return self._dwolla_uat_cancel_status_text_input