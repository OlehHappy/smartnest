__author__ = 'Juraj'

from selenium.webdriver.common.by import By

from pages.page_base import Page


class PropertyManagerAdmin(Page):
    def __init__(self, driver):
        self.driver = driver
        self._pma_login_input = "admin@mysmartnest.com"
        self._pma_password_input = "20admin14"
        self._all_properties_drop_down_locator = (By.CSS_SELECTOR, 'select.select.ng-pristine.ng-valid')
        self._payments_tab_link_locator = (By.LINK_TEXT, 'Payments')
        self._management_tab_link_locator = (By.LINK_TEXT, 'Management')
        self._management_data_tab_link_locator = (By.LINK_TEXT, 'Data')
        self._import_balance_updates_button_locator = (By.XPATH, '//div[@class="control-button"]/button[2]')
        self._upload_balance_choose_file_button_locator = (By.ID, "csv_file")
        self._import_balance_updates_file_button_locator = (By.XPATH, '//form[@id="import_form"]/div/button')
        self._proceed_with_update_button_locator = (By.CSS_SELECTOR, "button.button.good")
        self._balance_updated_succesfully_message_locator = (By.CSS_SELECTOR, "div.alert")
        self._error_tab_link_locator = (By.PARTIAL_LINK_TEXT, "error")
        self._reversed_payment_link_locator = (By.PARTIAL_LINK_TEXT, "Reversed")
        self._renters_reversed_table_locator = (By.XPATH, '//td[@title="Renter"]')
        self._reversed_payment_table_locator = (By.CSS_SELECTOR, 'div.loading_content')
        self._export_mark_locator = (By.XPATH, '//td[@title="Export Mark"]')
        self._renters_normal_payment_table_locator = (By.XPATH, '//td[@title="Renter"]')
        
        self._property_links_locator = (By.XPATH, '//div[@class="loading_content"]/table/tbody/tr/td/a')
        self._payment_drop_down_locator = (By.XPATH, '//div[@class="table_options"]/select')
        self._reversed_table_header_locator = (By.XPATH, '//table[@class="loading_content"]/thead/tr/th[2]')
        self._reversed_payment_date_old_locator = (By.XPATH, '//table[@class="loading_content ng-animate"]/tbody/tr/td[2]')
        self._reversed_payment_date_new_locator = (By.XPATH, '//div[@class="loading_content"]/div/table/tbody/tr/td[2]')
        self._recently_paid_link_locator = (By.LINK_TEXT, 'Recently paid')
        self._pagination_next_button_locator = (By.XPATH, '//nav[@class="pagination"]/button[2]')

    @property
    def pma_login(self):
        return self._pma_login_input

    @property
    def pma_password(self):
        return self._pma_password_input

    @property
    def all_propertis_drop_down(self):
        return self.driver.find_element(*self._all_properties_drop_down_locator)

    @property
    def payments_tab_link(self):
        return self.driver.find_element(*self._payments_tab_link_locator)

    @property
    def management_tab_link(self):
        return self.driver.find_element(*self._management_tab_link_locator)
    
    @property
    def import_balance_update_button(self):
        return self.driver.find_element(*self._import_balance_updates_button_locator)

    @property
    def management_data_tab_link(self):
        return self.driver.find_element(*self._management_data_tab_link_locator)

    @property
    def upload_balance_choose_file_button(self):
        return self.driver.find_element(*self._upload_balance_choose_file_button_locator)

    @property
    def upload_balance_updates_file_button(self):
        return self.driver.find_element(*self._import_balance_updates_file_button_locator)
    
    @property
    def proceed_with_update_button(self):
        return self.driver.find_element(*self._proceed_with_update_button_locator)

    @property
    def balance_updated_successfully_message(self):
        return self.driver.find_element(*self._balance_updated_succesfully_message_locator)

    @property
    def error_tab_link(self):
        return self.driver.find_element(*self._error_tab_link_locator)

    @property
    def reversed_payment_link(self):
        return self.driver.find_element(*self._reversed_payment_link_locator)

    @property
    def renters_reversed_table(self):
        return self.driver.find_elements(*self._renters_reversed_table_locator)

    @property
    def renters_normal_payment_table(self):
        return self.driver.find_elements(*self._renters_normal_payment_table_locator)

    @property
    def property_links_list(self):
        return self.driver.find_elements(*self._property_links_locator)

    @property
    def payment_drop_down(self):
        return self.driver.find_element(*self._payment_drop_down_locator)

    @property
    def reversed_payment_date_old(self):
        return self.driver.find_element(*self._reversed_payment_date_old_locator)

    @property
    def reversed_payment_date_new(self):
        return self.driver.find_element(*self._reversed_payment_date_new_locator)

    @property
    def recently_paid_link(self):
        return self.driver.find_element(*self._recently_paid_link_locator)

    @property
    def pagination_next_button(self):
        return self.driver.find_element(*self._pagination_next_button_locator)