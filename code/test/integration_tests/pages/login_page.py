from selenium.webdriver.common.by import By
from pages.page_base import Page


class Login(Page):
    """Login page object"""

    def __init__(self, driver):
        # Util_Elements.__init__(self, driver)
        self.driver = driver
        # page elements locators section
        self._emialTextField_locator = (By.ID, 'email')
        self._passwordTextField_locator = (By.ID, 'password')
        self._signInButton_locator = (By.XPATH, '//form[@name=\'form\']/fieldset/div[3]/button')
        self._sign_in_error_locator = (By.ID, 'signin_error')


    @property
    def login_email_textField(self):
        return self.driver.find_element(*self._emialTextField_locator)

    @property
    def login_password_textField(self):
        return self.driver.find_element(*self._passwordTextField_locator)

    @property
    def login_signIn_button(self):
        return self.driver.find_element(*self._signInButton_locator)

    @property
    def sign_in_error(self):
        return self.driver.find_element(*self._sign_in_error_locator)