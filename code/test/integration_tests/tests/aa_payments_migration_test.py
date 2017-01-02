import os

__author__ = 'juraj'
import time

from selenium.webdriver.common.by import By

from salsa_webqa.library.control_test import ControlTest
from pages.login_page import Login
from pages.landing_page import Landing
from pages.property_manager_admin_page import PropertyManagerAdmin
from pages.migration_page import Migration
from pages.renter_page import RenterDashboard
from salsa_webqa.library.support.selenium_support import SeleniumTest
from library.smartnest import SmartnestSupport

# noinspection PyProtectedMember
class TestADBMigration():
    def setup_class(self):
        self.smartnest_control = ControlTest()
        self.migration = TestADBMigration()

        self.driver_old = self.smartnest_control.start_browser()
        self.driver_new = self.smartnest_control.start_browser()

        self.landing_old = Landing(self.driver_old)
        self.landing_new = Landing(self.driver_new)

        self.login_old = Login(self.driver_old)
        self.login_new = Login(self.driver_new)

        self.pma_old = PropertyManagerAdmin(self.driver_old)
        self.pma_new = PropertyManagerAdmin(self.driver_new)

        self.selenium_old = SeleniumTest(self.driver_old)
        self.selenium_new = SeleniumTest(self.driver_new)

        self.smartnest_old = SmartnestSupport(self.driver_old)
        self.smartnest_new = SmartnestSupport(self.driver_new)

        self.migration_old = Migration(self.driver_old)
        self.migration_new = Migration(self.driver_new)

        self.renter_old = RenterDashboard(self.driver_old)
        self.renter_new = RenterDashboard(self.driver_new)

        self.driver_new.maximize_window()
        self.driver_old.maximize_window()

    # change name before push to git
    def teardown_class(self):
        self.driver_new.quit()
        self.driver_old.quit()

    def atest_multiple_windows(self):
        """
        Test >> OLD
        Try >> NEW
        :return:
        """

        self.driver_new.get(self.migration_new.try_new_db_url)
        self.driver_old.get(self.migration_old.try_old_db_url)

        time.sleep(1)
        if not self.selenium_old.is_element_present(self.login_old._signInButton_locator):
            self.landing_old.sign_in_landing_link.click()
        time.sleep(1)

        if not self.selenium_new.is_element_present(self.login_new._signInButton_locator):
            self.landing_new.sign_in_landing_link.click()
        time.sleep(1)

        self.smartnest_old.log_in(self.login_old._emialTextField_locator, self.pma_old.pma_login,
                                  self.login_old._passwordTextField_locator, self.pma_old.pma_password,
                                  self.login_old._signInButton_locator)

        self.smartnest_new.log_in(self.login_new._emialTextField_locator, self.pma_new.pma_login,
                                  self.login_new._passwordTextField_locator, self.pma_new.pma_password,
                                  self.login_new._signInButton_locator)
        property_links = list()

        property_links_old = self.pma_old.property_links_list
        property_links_new = self.pma_new.property_links_list

        for l in range(0, len(property_links_old)):
            property_links.append(property_links_old[l].text)

        reversed_payments_list_old = list()
        reversed_payments_list_new = list()

        reversed_payment_dict_old = {}
        reversed_payment_dict_new = {}

        payment_dict_old = {}
        payment_dict_new = {}

        payments_list_old = list()
        payments_list_new = list()

        not_compared_old = list()
        not_compared_new = list()

        for link in range(0, len(property_links)):
            if self.selenium_old.is_element_present((By.XPATH, '//div[@class="loading_content"]/div[2]/button')):
                # payments_list_new[:] = []
                # payments_list_old[:] = []
                # reversed_payments_list_new[:] = []
                # reversed_payments_list_old[:] = []

                # print str(link) + property_links[link]
                property_links_old[0].click()
                property_links_new[0].click()
                print property_links[0]

                self.pma_old.payments_tab_link.click()
                self.pma_new.payments_tab_link.click()

                self.selenium_old.wait_for_element_ready(self.pma_old._reversed_payment_table_locator)
                self.selenium_new.wait_for_element_ready(self.pma_new._export_mark_locator)

                self.selenium_old.select_dropdown_value(self.pma_old.payment_drop_down, 'reversed')
                self.pma_new.reversed_payment_link.click()

                reversed_payments_old = self.driver_old.find_elements(By.XPATH, '//table/tbody/tr')
                reversed_payments_new = self.driver_new.find_elements(By.XPATH,
                                                                      '//table[@class="loading_content"]/tbody/tr')

                reversed_payments_dates_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Date"]')
                reversed_payments_dates_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Date"]')

                reversed_payments_renters_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Renter"]')
                reversed_payments_renters_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Renter"]')

                reversed_payments_units_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Unit"]')
                reversed_payments_units_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Unit"]')

                reversed_payments_properties_old = self.driver_old.find_elements(By.XPATH,
                                                                                 '//td[@title="Property"]')
                reversed_payments_properties_new = self.driver_new.find_elements(By.XPATH,
                                                                                 '//td[@title="Property"]')

                reversed_payments_gateways_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Gateway"]')
                reversed_payments_gateways_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Gateway"]')

                reversed_payments_order_id_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Order Id"]')
                reversed_payments_order_id_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Order Id"]')

                reversed_payments_amounts_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Amount"]')
                reversed_payments_amounts_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Amount"]')

                for reversed_old in range(0, len(reversed_payments_renters_old)):
                    reversed_payment_dict_old['date'] = reversed_payments_dates_old[reversed_old].text
                    reversed_payment_dict_old['renter'] = reversed_payments_renters_old[reversed_old].text
                    reversed_payment_dict_old['unit'] = reversed_payments_units_old[reversed_old].text
                    reversed_payment_dict_old['property'] = reversed_payments_properties_old[reversed_old].text
                    reversed_payment_dict_old['gateway'] = reversed_payments_gateways_old[reversed_old].text
                    reversed_payment_dict_old['order_id'] = reversed_payments_order_id_old[reversed_old].text
                    reversed_payment_dict_old['amount'] = reversed_payments_amounts_old[3 * reversed_old].text
                    reversed_payment_dict_old['compared'] = False

                    reversed_payments_list_old.append(reversed_payment_dict_old.copy())

                for reversed_new in range(0, len(reversed_payments_renters_new)):
                    reversed_payment_dict_new['date'] = reversed_payments_dates_new[reversed_new].text
                    reversed_payment_dict_new['renter'] = reversed_payments_renters_new[reversed_new].text
                    reversed_payment_dict_new['unit'] = reversed_payments_units_new[reversed_new].text
                    reversed_payment_dict_new['property'] = reversed_payments_properties_new[reversed_new].text
                    reversed_payment_dict_new['gateway'] = reversed_payments_gateways_new[reversed_new].text
                    reversed_payment_dict_new['order_id'] = reversed_payments_order_id_new[reversed_new].text
                    reversed_payment_dict_new['amount'] = reversed_payments_amounts_new[reversed_new].text
                    reversed_payment_dict_new['compared'] = False

                    reversed_payments_list_new.append(reversed_payment_dict_new.copy())

                self.selenium_old.select_dropdown_value(self.pma_old.payment_drop_down, 'recently paid')
                self.pma_new.recently_paid_link.click()

                time.sleep(3)

                while True:

                    payments_dates_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Date"]')
                    payments_renters_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Renter"]')
                    payments_units_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Unit"]')
                    payments_properties_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Property"]')
                    payments_gateways_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Gateway"]')
                    payments_order_id_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Order Id"]')
                    payments_amounts_old = self.driver_old.find_elements(By.XPATH,
                                                                         '//*[@id="admin-payment"]/main/section[1]/section/ui-view/section/div[2]/div/table/tbody/tr/td[11]')

                    for payment_old in range(0, len(payments_renters_old)):
                        payment_dict_old['date'] = payments_dates_old[payment_old].text
                        payment_dict_old['renter'] = payments_renters_old[payment_old].text
                        payment_dict_old['unit'] = payments_units_old[payment_old].text
                        payment_dict_old['property'] = payments_properties_old[payment_old].text
                        payment_dict_old['gateway'] = payments_gateways_old[payment_old].text
                        payment_dict_old['order_id'] = payments_order_id_old[payment_old].text
                        payment_dict_old['amount'] = payments_amounts_old[payment_old].text
                        payment_dict_old['compared'] = False

                        payments_list_old.append(payment_dict_old.copy())

                    if not self.smartnest_old.is_disabled(self.pma_old._pagination_next_button_locator):
                        break
                    self.pma_old.pagination_next_button.click()

                while True:
                    payments_dates_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Date"]')
                    payments_renters_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Renter"]')
                    payments_units_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Unit"]')
                    payments_properties_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Property"]')
                    payments_gateways_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Gateway"]')
                    payments_order_id_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Order Id"]')
                    payments_amounts_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Amount"]')

                    for payment_new in range(0, len(payments_renters_new)):
                        payment_dict_new['date'] = payments_dates_new[payment_new].text
                        payment_dict_new['renter'] = payments_renters_new[payment_new].text
                        payment_dict_new['unit'] = payments_units_new[payment_new].text
                        payment_dict_new['property'] = payments_properties_new[payment_new].text
                        payment_dict_new['gateway'] = payments_gateways_new[payment_new].text
                        payment_dict_new['order_id'] = payments_order_id_new[payment_new].text
                        payment_dict_new['amount'] = payments_amounts_new[payment_new].text
                        payment_dict_new['compared'] = False

                        payments_list_new.append(payment_dict_new.copy())

                    if not self.smartnest_new.is_disabled(self.pma_new._pagination_next_button_locator):
                        break

                    self.pma_new.pagination_next_button.click()

                for old in range(0, len(payments_list_old)):
                    # print "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
                    to_compare_old = payments_list_old[old]
                    # print "====" + to_compare_old['order_id']
                    for new in range(0, len(payments_list_new)):
                        # print "*****************************"
                        to_compare_new = payments_list_new[new]
                        # print "+++++++" + to_compare_new['order_id']
                        if to_compare_old['order_id'] == to_compare_new['order_id']:
                            if (to_compare_old['date'] == to_compare_new['date']) and (
                                        to_compare_old['renter'] == to_compare_new['renter']) and (
                                        to_compare_old['unit'] == to_compare_new['unit']) and (
                                        to_compare_old['property'] == to_compare_new['property']) and (
                                        to_compare_old['gateway'] == to_compare_new['gateway']) and (
                                        to_compare_old['amount'] == to_compare_new['amount']):
                                to_compare_old['compared'] = True
                                to_compare_new['compared'] = True

            else:
                print property_links[link]
                self.selenium_old.select_dropdown_value(self.pma_old.all_propertis_drop_down, property_links[link])
                self.selenium_new.select_dropdown_value(self.pma_new.all_propertis_drop_down, property_links[link])

                self.pma_old.payments_tab_link.click()
                self.pma_new.payments_tab_link.click()

                if self.selenium_old.is_element_visible(self.pma_old._pagination_next_button_locator):
                    self.selenium_old.select_dropdown_value(self.pma_old.payment_drop_down, 'reversed')
                    self.pma_new.reversed_payment_link.click()

                    reversed_payments_old = self.driver_old.find_elements(By.XPATH, '//table/tbody/tr')
                    reversed_payments_new = self.driver_new.find_elements(By.XPATH,
                                                                          '//table[@class="loading_content"]/tbody/tr')

                    reversed_payments_dates_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Date"]')
                    reversed_payments_dates_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Date"]')

                    reversed_payments_renters_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Renter"]')
                    reversed_payments_renters_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Renter"]')

                    reversed_payments_units_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Unit"]')
                    reversed_payments_units_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Unit"]')

                    reversed_payments_properties_old = self.driver_old.find_elements(By.XPATH,
                                                                                     '//td[@title="Property"]')
                    reversed_payments_properties_new = self.driver_new.find_elements(By.XPATH,
                                                                                     '//td[@title="Property"]')

                    reversed_payments_gateways_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Gateway"]')
                    reversed_payments_gateways_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Gateway"]')

                    reversed_payments_order_id_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Order Id"]')
                    reversed_payments_order_id_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Order Id"]')

                    reversed_payments_amounts_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Amount"]')
                    reversed_payments_amounts_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Amount"]')

                    for reversed_old in range(0, len(reversed_payments_renters_old)):
                        reversed_payment_dict_old['date'] = reversed_payments_dates_old[reversed_old].text
                        reversed_payment_dict_old['renter'] = reversed_payments_renters_old[reversed_old].text
                        reversed_payment_dict_old['unit'] = reversed_payments_units_old[reversed_old].text
                        reversed_payment_dict_old['property'] = reversed_payments_properties_old[reversed_old].text
                        reversed_payment_dict_old['gateway'] = reversed_payments_gateways_old[reversed_old].text
                        reversed_payment_dict_old['order_id'] = reversed_payments_order_id_old[reversed_old].text
                        reversed_payment_dict_old['amount'] = reversed_payments_amounts_old[3 * reversed_old].text
                        reversed_payment_dict_old['compared'] = False

                        reversed_payments_list_old.append(reversed_payment_dict_old.copy())

                    for reversed_new in range(0, len(reversed_payments_renters_new)):
                        reversed_payment_dict_new['date'] = reversed_payments_dates_new[reversed_new].text
                        reversed_payment_dict_new['renter'] = reversed_payments_renters_new[reversed_new].text
                        reversed_payment_dict_new['unit'] = reversed_payments_units_new[reversed_new].text
                        reversed_payment_dict_new['property'] = reversed_payments_properties_new[reversed_new].text
                        reversed_payment_dict_new['gateway'] = reversed_payments_gateways_new[reversed_new].text
                        reversed_payment_dict_new['order_id'] = reversed_payments_order_id_new[reversed_new].text
                        reversed_payment_dict_new['amount'] = reversed_payments_amounts_new[reversed_new].text
                        reversed_payment_dict_new['compared'] = False

                        reversed_payments_list_new.append(reversed_payment_dict_new.copy())

                    self.selenium_old.select_dropdown_value(self.pma_old.payment_drop_down, 'recently paid')
                    self.pma_new.recently_paid_link.click()

                    time.sleep(3)

                    while True:
                        payments_dates_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Date"]')
                        payments_renters_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Renter"]')
                        payments_units_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Unit"]')
                        payments_properties_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Property"]')
                        payments_gateways_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Gateway"]')
                        payments_order_id_old = self.driver_old.find_elements(By.XPATH, '//td[@title="Order Id"]')
                        payments_amounts_old = self.driver_old.find_elements(By.XPATH,
                                                                             '//*[@id="admin-payment"]/main/section[1]/section/ui-view/section/div[2]/div/table/tbody/tr/td[11]')
                        for payment_old in range(0, len(payments_renters_old)):
                            payment_dict_old['date'] = payments_dates_old[payment_old].text
                            payment_dict_old['renter'] = payments_renters_old[payment_old].text
                            payment_dict_old['unit'] = payments_units_old[payment_old].text
                            payment_dict_old['property'] = payments_properties_old[payment_old].text
                            payment_dict_old['gateway'] = payments_gateways_old[payment_old].text
                            payment_dict_old['order_id'] = payments_order_id_old[payment_old].text
                            payment_dict_old['amount'] = payments_amounts_old[payment_old].text
                            payment_dict_old['compared'] = False

                            payments_list_old.append(payment_dict_old.copy())

                        if not self.smartnest_old.is_disabled(self.pma_old._pagination_next_button_locator):
                            break
                        self.pma_old.pagination_next_button.click()

                    while True:
                        payments_dates_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Date"]')
                        payments_renters_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Renter"]')
                        payments_units_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Unit"]')
                        payments_properties_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Property"]')
                        payments_gateways_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Gateway"]')
                        payments_order_id_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Order Id"]')
                        payments_amounts_new = self.driver_new.find_elements(By.XPATH, '//td[@title="Amount"]')

                        for payment_new in range(0, len(payments_renters_new)):
                            payment_dict_new['date'] = payments_dates_new[payment_new].text
                            payment_dict_new['renter'] = payments_renters_new[payment_new].text
                            payment_dict_new['unit'] = payments_units_new[payment_new].text
                            payment_dict_new['property'] = payments_properties_new[payment_new].text
                            payment_dict_new['gateway'] = payments_gateways_new[payment_new].text
                            payment_dict_new['order_id'] = payments_order_id_new[payment_new].text
                            payment_dict_new['amount'] = payments_amounts_new[payment_new].text
                            payment_dict_new['compared'] = False

                            payments_list_new.append(payment_dict_new.copy())

                        if not self.smartnest_new.is_disabled(self.pma_new._pagination_next_button_locator):
                            break

                        self.pma_new.pagination_next_button.click()

                    for old in range(0, len(payments_list_old)):
                        to_compare_old = payments_list_old[old]
                        for new in range(0, len(payments_list_new)):
                            to_compare_new = payments_list_new[new]

                            if to_compare_old['order_id'] == to_compare_new['order_id']:
                                if (to_compare_old['date'] == to_compare_new['date']) and (
                                            to_compare_old['renter'] == to_compare_new['renter']) and (
                                            to_compare_old['unit'] == to_compare_new['unit']) and (
                                            to_compare_old['property'] == to_compare_new['property']) and (
                                            to_compare_old['gateway'] == to_compare_new['gateway']) and (
                                            to_compare_old['amount'] == to_compare_new['amount']):
                                    to_compare_old['compared'] = True
                                    to_compare_new['compared'] = True
                                    # else:

        for a in range(0, len(payments_list_new)):
            if not payments_list_new[a]['compared']:
                not_compared_new.append(payments_list_new[a].copy())

        for b in range(0, len(payments_list_old)):
            if not payments_list_old[b]['compared']:
                not_compared_old.append(payments_list_old[b].copy())

        for not_comp_old in range(0, len(not_compared_old)):
            no_compare = not_compared_old[not_comp_old]
            for rev_new in range(0, len(reversed_payments_list_new)):
                to_comp_rev_new = reversed_payments_list_new[rev_new]
                if no_compare['order_id'] == to_comp_rev_new['order_id']:
                    if (no_compare['renter'] == to_comp_rev_new['renter']) and (
                                no_compare['unit'] == to_comp_rev_new['unit']) and (
                                no_compare['property'] == to_comp_rev_new['property']) and (
                                no_compare['gateway'] == to_comp_rev_new['gateway']) and (
                                no_compare['amount'] == to_comp_rev_new['amount']):
                        no_compare['compared'] = True
                        to_comp_rev_new['compared'] = True

        for not_comp_new in range(0, len(not_compared_new)):
            no_compare_new = not_compared_new[not_comp_new]
            for rev_old in range(0, len(reversed_payments_list_old)):
                to_comp_rev_old = reversed_payments_list_old[rev_old]
                if no_compare_new['order_id'] == to_comp_rev_old['order_id']:
                    if (no_compare_new['renter'] == to_comp_rev_old['renter']) and (
                                no_compare_new['unit'] == to_comp_rev_old['unit']) and (
                                no_compare_new['property'] == to_comp_rev_old['property']) and (
                                no_compare_new['gateway'] == to_comp_rev_old['gateway']) and (
                                no_compare_new['amount'] == to_comp_rev_old['amount']):
                        no_compare_new['compared'] = True
                        to_comp_rev_old['compared'] = True

        print "Not compared payments from migrated DB"
        for q in range(0, len(not_compared_new)):
            if not not_compared_new[q]['compared']:
                print str(not_compared_new[q])

        print "Not compared payments from old DB"
        for w in range(0, len(not_compared_old)):
            if not not_compared_old[w]['compared']:
                print str(not_compared_old[w])

        print "Not compared payments from Reversed old DB"
        for p in range(0, len(reversed_payments_list_old)):
            if not reversed_payments_list_old[p]['compared']:
                print reversed_payments_list_old[p]

        print "Not compared payments from Reversed new DB"
        for t in range(0, len(reversed_payments_list_new)):
            if not reversed_payments_list_new[t]['compared']:
                print reversed_payments_list_new[t]

        self.smartnest_old.log_out(self.renter_old._user_drop_down_link_locator,
                                   self.renter_old._signout_link_locator)

        self.smartnest_new.log_out(self.renter_new._user_drop_down_link_locator,
                                   self.renter_new._signout_link_locator)

        time.sleep(1)
        assert False

    def atest_renter_with_error(self):

        no_payments_list = list()
        error_payments_list = list()
        no_status_list = list()
        renter_list_of_emails = self.smartnest_old.load_json_file(
            os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir, 'tests', 'data',
                         'listRenterEmails.json'))

        time.sleep(1)
        if not self.selenium_old.is_element_present(self.login_old._signInButton_locator):
            self.landing_old.sign_in_landing_link.click()
        time.sleep(1)

        for i in range(0, len(renter_list_of_emails)):
            # payments_list_new[:] = []
            no_payments_list[:] = []
            error_payments_list[:] = []
            no_status_list[:] = []
            renters = renter_list_of_emails[i]
            renter = renters['renter']
            property_name = renters['property']
            print "Checking property: " + property_name

            for k in range(0, len(renter)):
                renter_a = renter[k]
                email_address = renter_a['email']
                time.sleep(1)
                self.smartnest_old.log_in(self.login_old._emialTextField_locator, email_address,
                                          self.login_old._passwordTextField_locator, '1',
                                          self.login_old._signInButton_locator)

                time.sleep(2)
                print "Checking email: " + email_address
                no_active_contract_locator = (
                    By.XPATH, '//*[@id="front-contract"]/main/section[1]/section/ui-view/section/h1')
                try:
                    self.selenium_old.wait_for_element_visible(no_active_contract_locator, 5)
                except:
                    pass
                no_active_contract_text = self.driver_old.find_element(*no_active_contract_locator).text
                if no_active_contract_text == 'No active contract':
                    self.smartnest_old.log_out(self.renter_old._user_drop_down_link_locator,
                                               self.renter_old._signout_link_locator)
                else:
                    time.sleep(1)
                    self.renter_old.payment_tab_link.click()
                    time.sleep(1)
                    renter_payments_table_locator = (By.XPATH,
                                                     '//*[@id="front-contract"]/main/section[1]/section/ui-view/section/div/div/div/div/div/div[2]/table')
                    self.selenium_old.wait_for_element_ready(renter_payments_table_locator)

                    no_payment_history = self.driver_old.find_element(By.XPATH,
                                                                      '//*[@id="front-contract"]/main/section[1]/section/ui-view/section/div/div/div/div/div/div[2]/table/tbody/tr/td').text

                    if no_payment_history == 'No Payment History':
                        no_payments_list.append(email_address)
                    else:
                        payments_status = self.driver_old.find_elements(By.XPATH, '//td[@title="Status"]')

                        for status in range(0, len(payments_status)):
                            # print "****************** " + payments_status[status].text
                            if payments_status[status].text == 'error':
                                error_payments_list.append(email_address)
                            if payments_status[status].text == "":
                                no_status_list.append(email_address)

                    self.smartnest_old.log_out(self.renter_old._user_drop_down_link_locator,
                                               self.renter_old._signout_link_locator)

            print "Emails of renters with error status in payments"
            for error_payment in range(0, len(error_payments_list)):
                print error_payments_list[error_payment]

            print "Emails of renters with empty status"
            for nostat in range(0, len(no_status_list)):
                print no_status_list[nostat]
        time.sleep(1)

        assert False