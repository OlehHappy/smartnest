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

        # ## Tests ###

        # @pytest.mark.parametrize(
        #     ('manager_login', 'manager_password', 'renter_surname', 'renter_first_name', 'renter_birth_month',
        #      'renter_birth_day', 'unit_number'),
        #     [('admin@mysmartnest.com', '20admin14', 'Hoskins', 'Megan', '07', '06', '1511'), ])
        # # [('property.manager1@lasventanas.com', '1', 'Mendoza', 'Julio', '10', '23', '704'),
        # #('superadmin@mysmartnest.com', '20superadmin14', 'Shepherd', 'DeErris', '08', '28', '110')
        # def test_invite_new_renter(self, manager_login, manager_password, renter_surname, renter_first_name,
        #                            renter_birth_month, renter_birth_day, unit_number):
        #     """
        #     test will go trough all account types which can invite a new renter and invite new renter one by one
        #     """
        #     self.landing.signIn_landing_link.click()
        #     time.sleep(1)
        #     log_in(self, self.login.login_email_textField, manager_login, self.login.login_password_textField,
        #            manager_password, self.login.login_signIn_button)
        #     self.property_list.las_ventanas_link.click()
        #
        #
        #     assert False

        # def test_invite_new_facility_manager(self):
        #     """
        #     test will go trough all account types which can invite a new facility manager and invite new facility manager
        #     one by one
        #     """
        #     #TODO implement test
        #     assert False
        #
        # def test_invite_new_property_manager(self):
        #     """
        #     test will go trough all account types which can invite a new property manager and invite new property manager
        #     one by one
        #     """
        #     #TODO implement test
        #     assert False
        #
        # def test_invite_new_property_manager_admin(self):
        #     """
        #     test will go trough all account types which can invite a new property manager admin and invite new property
        #     manager admin one by one
        #     """
        #     #TODO implement test
        #     assert False
        #
        # def test_invite_new_superadmin(self):
        #     """
        #     test will go trough all account types which can invite a new super admin and invite new super admin one by one
        #     """
        #     #TODO implement test
        #     assert False
        #
        #
        # ### Section for test of input validation ###
        # def test_invite_existing_renter(self):
        #     #TODO implement test
        #     assert False
        #
        # def test_invite_none_existing_renter(self):
        #     #TODO implement test
        #     assert False
        #
        # def test_new_facility_manager_incorrect_email(self):
        #     #TODO implement test
        #     assert False
        #
        # def test_new_facility_manager_duplicate_email(self):
        #     #TODO implement test
        #     assert False