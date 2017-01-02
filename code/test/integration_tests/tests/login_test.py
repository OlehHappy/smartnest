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
'''
    @pytest.mark.parametrize(('email', 'password'),
                             [('superadmin@mysmartnest.com', '20superadmin14!',),
                              ('admin@mysmartnest.com', '20admin14',),
                              ('property.manager.automation@renter.com', '1',),
                              ('facility.manager.automation@renter.com', '1',), ])
    def test_login_logout(self, email, password):
        """
        Test checks whether it is possible to log into application as superadmin, admin, property manager and facility
        manager existing already in database. Test checks whether Smartnest logo, Add property and Statistics Dashboard
        1. For Superadmin: Smartnest logo, Add property, Statistics Dashboard and list of all properties under management
        2. For Admin: Smartnest logo, Add property and list of all properties under management
        3. For Property manager: Smartnest logo and list of properties under manager control
        4. For Facility manager: Smartnest logo and list of properties under manager control
        :param email: user's email for login
        :param password: user's password for login
        """
        if not self.test_selenium.is_element_present(self.login._signInButton_locator):
            self.landing.sign_in_landing_link.click()
        time.sleep(1)
        self.smartnest.log_in(self.login._emialTextField_locator, email,
                              self.login._passwordTextField_locator, password,
                              self.login._signInButton_locator)
        time.sleep(1)

        logo = self.property_list.smartnest_logo.text

        assert logo == self.property_list.smartnest_logo_text

        if email == 'superadmin@mysmartnest.com':
            assert self.test_selenium.is_element_present(self.property_list._smartnest_logo_element_locator)
            assert self.test_selenium.is_element_present(self.property_list._castle_way_locator)
            assert self.test_selenium.is_element_present(self.property_list._colonie_apartments_locator)
            assert self.test_selenium.is_element_present(self.property_list._forest_oaks_locator)
            assert self.test_selenium.is_element_present(self.property_list._hillcrest_oakwood_locator)
            assert self.test_selenium.is_element_present(self.property_list._las_ventanas_locator)
            assert self.test_selenium.is_element_present(self.property_list._raiders_ridge_locator)
            assert self.test_selenium.is_element_present(self.property_list._rivercrest_apartments_locator)
            assert self.test_selenium.is_element_present(self.property_list._sidway_building_locator)
            assert self.test_selenium.is_element_present(self.property_list._southgate_locator)
            assert self.test_selenium.is_element_present(self.property_list._stone_farm_locator)
            assert self.test_selenium.is_element_present(self.property_list._the_landing_locator)
            assert self.test_selenium.is_element_present(self.property_list._twenty_two_cottages_locator)
            assert self.test_selenium.is_element_present(self.property_list._university_courtyard_locator)
            assert self.test_selenium.is_element_present(self.property_list._university_estates_locator)
            assert self.test_selenium.is_element_present(self.property_list._university_heights_ii_locator)
            assert self.test_selenium.is_element_present(self.property_list._university_villages_locator)
            assert self.test_selenium.is_element_present(self.property_list._willowbrook_west_locator)
            assert self.test_selenium.is_element_present(self.property_list._wolf_creek_i_locator)
            assert self.test_selenium.is_element_present(self.property_list._wolf_creek_ii_locator)
            assert self.test_selenium.is_element_present(self.property_list._add_new_property_button_locator)
            assert self.test_selenium.is_element_present(self.property_list._statistics_dashboard_button_locator)
            assert self.test_selenium.is_element_present(self.property_list._table_header_total_units_locator)
            assert self.test_selenium.is_element_present(self.property_list._table_header_inactive_locator)
            assert self.test_selenium.is_element_present(self.property_list._table_header_active_locator)
        elif email == 'admin@mysmartnest.com':
            assert self.test_selenium.is_element_present(self.property_list._smartnest_logo_element_locator)
            assert self.test_selenium.is_element_present(self.property_list._castle_way_locator)
            assert self.test_selenium.is_element_present(self.property_list._colonie_apartments_locator)
            assert self.test_selenium.is_element_present(self.property_list._forest_oaks_locator)
            assert self.test_selenium.is_element_present(self.property_list._hillcrest_oakwood_locator)
            assert self.test_selenium.is_element_present(self.property_list._las_ventanas_locator)
            assert self.test_selenium.is_element_present(self.property_list._raiders_ridge_locator)
            assert self.test_selenium.is_element_present(self.property_list._sidway_building_locator)
            assert self.test_selenium.is_element_present(self.property_list._southgate_locator)
            assert self.test_selenium.is_element_present(self.property_list._stone_farm_locator)
            assert self.test_selenium.is_element_present(self.property_list._the_landing_locator)
            assert self.test_selenium.is_element_present(self.property_list._twenty_two_cottages_locator)
            assert self.test_selenium.is_element_present(self.property_list._university_courtyard_locator)
            assert self.test_selenium.is_element_present(self.property_list._university_estates_locator)
            assert self.test_selenium.is_element_present(self.property_list._university_heights_ii_locator)
            assert self.test_selenium.is_element_present(self.property_list._university_villages_locator)
            assert self.test_selenium.is_element_present(self.property_list._willowbrook_west_locator)
            assert self.test_selenium.is_element_present(self.property_list._wolf_creek_i_locator)
            assert self.test_selenium.is_element_present(self.property_list._wolf_creek_ii_locator)
            assert self.test_selenium.is_element_present(self.property_list._add_new_property_button_locator)
            assert self.test_selenium.is_element_present(self.property_list._statistics_dashboard_button_locator)
            assert self.test_selenium.is_element_present(self.property_list._table_header_total_units_locator)
            assert self.test_selenium.is_element_present(self.property_list._table_header_inactive_locator)
            assert self.test_selenium.is_element_present(self.property_list._table_header_active_locator)
        elif email == 'property.manager.automation@renter.com':
            assert self.test_selenium.is_element_present(self.property_list._smartnest_logo_element_locator)
            assert self.test_selenium.is_element_present(self.property_list._hillcrest_oakwood_locator)
            assert self.test_selenium.is_element_present(self.property_list._las_ventanas_locator)
            assert self.test_selenium.is_element_present(self.property_list._the_landing_locator)
            assert self.test_selenium.is_element_present(self.property_list._table_header_total_units_locator)
            assert self.test_selenium.is_element_present(self.property_list._table_header_inactive_locator)
            assert self.test_selenium.is_element_present(self.property_list._table_header_active_locator)
        elif email == 'facility.manager.automation@renter.com':
            assert self.test_selenium.is_element_present(self.property_list._smartnest_logo_element_locator)
            assert self.test_selenium.is_element_present(self.property_list._table_header_total_units_locator)
            assert self.test_selenium.is_element_present(self.property_list._table_header_inactive_locator)
            assert self.test_selenium.is_element_present(self.property_list._table_header_active_locator)
            assert self.test_selenium.is_element_present(self.property_list._hillcrest_oakwood_locator)
            assert self.test_selenium.is_element_present(self.property_list._wolf_creek_i_locator)

        self.smartnest.log_out(self.header._user_name_link_locator, self.header._signout_link_locator)
        time.sleep(1)

        assert self.test_selenium.is_element_present(self.landing._sign_in_button_locator)
        assert self.test_selenium.is_element_present(self.landing._sing_in_header_text_locator)

    @pytest.mark.parametrize(('email', 'password'),
                             [('', '',),
                              ('', '20admin14',),
                              ('admin@mysmartnest.com', '',),
                              ('aaa', 'aaa',),
                              ('', 'aaa',),
                              ('aaa', '',),
                              ('superadmin@mysmartnest.com', '20admin14',), ])
    def test_invalid_login(self, email, password):
        """
        Test checks whether it is not possible to log into application using either empty or incorrect email or password
        :param email: user's email for login
        :param password: user's password for login
        """
        if not self.test_selenium.is_element_present(self.login._signInButton_locator):
            self.landing.sign_in_landing_link.click()

        self.smartnest.log_in(self.login._emialTextField_locator, email,
                              self.login._passwordTextField_locator, password,
                              self.login._signInButton_locator)
        time.sleep(4)
        expected_error_message = 'Invalid email or password.'
        error_message = self.driver.find_element(*self.landing._error_message_login_locator)
        assert expected_error_message == error_message.text'''
