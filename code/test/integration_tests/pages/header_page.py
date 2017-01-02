__author__ = 'Juraj'
from selenium.webdriver.common.by import By

from pages.page_base import Page


class Header(Page):
    def __init__(self, driver):
        self.driver = driver
        # page elements locators section
        # link pointing to user's name in page right upper corner
        # self._user_name_link_locator = (By.CSS_SELECTOR, 'li.dropdown')
        self._user_name_link_locator = (By.XPATH, '//*[@id="admin-property"]/header/nav/ul/li/a/span')
        self._signout_link_locator = (By.LINK_TEXT, 'Signout')


    @property
    def user_name_link(self):
        return self.driver.find_element(*self._user_name_link_locator)

    @property
    def signout_link(self):
        return self.driver.find_element(*self._signout_link_locator)
