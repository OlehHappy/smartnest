__author__ = 'Juraj'

from salsa_webqa.library.control_test import ControlTest
from pages.landing_page import Landing
from pages.login_page import Login
from pages.header_page import Header
from pages.property_list_page import Property_List
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
        self.header = Header(self.driver)
        self.property_list = Property_List(self.driver)
        self.smartnest = SmartnestSupport(self.driver)
        self.test_selenium = SeleniumTest(self.driver)

    def teardown_class(self):
        self.smartnest_control.stop_browser()

    def setup_method(self, method):
        self.smartnest_control.start_test()

    def teardown_method(self, method):
        """ executes after test function finishes """
        test_info = get_test_info()
        self.smartnest_control.stop_test(test_info)