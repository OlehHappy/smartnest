__author__ = 'Juraj'

from pages.page_base import Page


class Migration(Page):
    def __init__(self, driver):
        self.driver = driver
        # page elements locators section
        # link pointing to user's name in page right upper corner
        # self._user_name_link_locator = (By.CSS_SELECTOR, 'li.dropdown')
        self._try_old_db_url = "http://smartnest-test.herokuapp.com/"
        self._try_new_db_url = "http://smartnest-try.herokuapp.com/"

    @property
    def try_old_db_url(self):
        return self._try_old_db_url

    @property
    def try_new_db_url(self):
        return self._try_new_db_url
