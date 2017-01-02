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

    # ### Tests ###
    # ### Tests for Property manager admin profile
    #
    # def test_profile_update_profile(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # ### Tests for Property details tab on Property manager admin dashboard header
    #
    # def test_update_property_details_name(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_update_property_details_address(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_update_property_details_website(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_update_property_details_description(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    #
    # ### Tests for Property editor tab on Property manager admin dashboard header
    #
    # def test_property_editor_displayed_data(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_property_editor_units_paging(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_update_property_details(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_omit_mandatory_field(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_zip_code_autocomplete(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_emergency_phone(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_add_new_appartment(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_delete_apartment(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_add_new_unit(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_delete_unit(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_cancel_update(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_delete_property(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_add_property_manager(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_remove_property_manager(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_add_facility_manager(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_remove_facility_manager(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_edit_property_update_description(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # ### Test for Maintenance requests tab on Property manager admin dashboard header
    #
    # def test_request_changing_status(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_request_replying_to_renter(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_request_searching_by_unit(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_request_filtering_requests_by_status(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # ### Tests for Payments tab on Property manager admin dashboard header
    #
    # def test_payments_outstanding_balances_paging(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_payments_outstanding_balances_search_by_unit(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_payments_recently_paid_data(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_payments_recently_paid_export_data(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_payments_recently_paid_search_by_unit(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_payments_account_history_data(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_payments_account_history_search_by_unit(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # ### Tests for Management tab on Property manager admin dashboard header
    #
    # def test_management_user_add_user_valid_data_input(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_management_user_add_user_invalid_data_input(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_management_user_search_by_last_name(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_management_data_filtering_data(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_management_data_import_balance_updates_valid_file(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_management_data_import_balance_updates_invalid_file(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_management_data_import_birthdays_valid_file(self):
    #     #TODO implement test steps and assertions
    #     assert False
    #
    # def test_management_data_import_birthdays_invalid_file(self):
    #     #TODO implement test steps and assertions
    #     assert False