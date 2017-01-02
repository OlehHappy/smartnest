from selenium.webdriver.common.by import By


class Landing():
    """Landing page object"""

    def __init__(self, driver):
        # Util_Elements.__init__(self, driver)
        self.driver = driver
        # element locators
        self._sign_in_link_locator = (By.LINK_TEXT, 'Sign In')
        # Sign in button locator
        self._sign_in_button_locator = (By.XPATH, '//form[@name="form"]/fieldset/div[3]/button')
        # "Sign in to your account" header text
        self._sing_in_header_text_locator = (By.XPATH, '//form[@name="form"]/h1')
        # Error message after providing incorrect email, password
        self._error_message_login_locator = (By.ID, 'signin_error')

    @property
    def sign_in_landing_link(self):
        return self.driver.find_element(*self._sign_in_link_locator)

    @property
    def sign_in_button(self):
        return self.driver.find_element(*self._sign_in_button_locator)

    @property
    def sign_in_header_text(self):
        return self.driver.find_element(*self._sing_in_header_text_locator)

    @property
    def error_message_login(self):
        return self.driver.find_element(*self._error_message_login_locator)