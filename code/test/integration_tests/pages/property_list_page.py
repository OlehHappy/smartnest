__author__ = 'Juraj'
from selenium.webdriver.common.by import By


class Property_List():
    def __init__(self, driver):
        # Util_Elements.__init__(self, driver)
        self.driver = driver

        # element locators for Properties on Property List
        self._smartnest_logo_element_locator = (By.CSS_SELECTOR, 'a.navbar-brand')
        self._castle_way_locator = (By.LINK_TEXT, 'Castle Way Apartments')
        self._colonie_apartments_locator = (By.LINK_TEXT, 'Colonie Apartments')
        self._forest_oaks_locator = (By.LINK_TEXT, 'Forest Oaks Apartments')
        self._hillcrest_oakwood_locator = (By.LINK_TEXT, 'Hillcrest Oakwood Apartments')
        self._las_ventanas_locator = (By.LINK_TEXT, 'Las Ventanas')
        self._raiders_ridge_locator = (By.LINK_TEXT, 'Raiders Ridge Apartments')
        self._rivercrest_apartments_locator = (By.LINK_TEXT, 'Rivercrest Apartments')
        self._sidway_building_locator = (By.LINK_TEXT, 'Sidway Building Apartments')
        self._southgate_locator = (By.LINK_TEXT, 'Southgate Apartments')
        self._stone_farm_locator = (By.LINK_TEXT, 'Stone Farm Apartments')
        self._the_landing_locator = (By.LINK_TEXT, 'The Landing')
        self._twenty_two_cottages_locator = (By.LINK_TEXT, 'Twenty-Twenty Cottages')
        self._university_courtyard_locator = (By.LINK_TEXT, 'University Courtyard')
        self._university_estates_locator = (By.LINK_TEXT, 'University Estates')
        self._university_heights_ii_locator = (By.LINK_TEXT, 'University Heights II')
        self._university_villages_locator = (By.LINK_TEXT, 'University Villages')
        self._willowbrook_west_locator = (By.LINK_TEXT, 'Willowbrook West Apartments')
        self._wolf_creek_i_locator = (By.LINK_TEXT, 'Wolf Creek I')
        self._wolf_creek_ii_locator = (By.LINK_TEXT, 'Wolf Creek II')
        self._add_new_property_button_locator = (By.CSS_SELECTOR, 'button.good')
        self._statistics_dashboard_button_locator = (By.CSS_SELECTOR, 'button.primary')
        self._table_header_property_locator = (By.XPATH, '//div[@class="loading_content"]/table/thead/tr/th[1]')
        self._table_header_total_units_locator = (By.XPATH, '//div[@class="loading_content"]/table/thead/tr/th[2]')
        self._table_header_inactive_locator = (By.XPATH, '//div[@class="loading_content"]/table/thead/tr/th[3]')
        self._table_header_active_locator = (By.XPATH, '//div[@class="loading_content"]/table/thead/tr/th[4]')

        #data for expected results
        self._smartnest_logo_text = 'mySmartNest'


    @property
    def smartnest_logo(self):
        return self.driver.find_element(*self._smartnest_logo_element_locator)

    @property
    def castle_way_link(self):
        return self.driver.find_element(*self._castle_way_locator)

    @property
    def colonie_apartments_link(self):
        return self.driver.find_element(*self._colonie_apartments_locator)

    @property
    def forest_oaks_link(self):
        return self.driver.find_element(*self._forest_oaks_locator)

    @property
    def hillcrest_oakwood_link(self):
        return self.driver.find_element(*self._hillcrest_oakwood_locator)

    @property
    def las_ventanas_link(self):
        return self.driver.find_element(*self._las_ventanas_locator)

    @property
    def raiders_ridge_link(self):
        return self.driver.find_element(*self._raiders_ridge_locator)

    @property
    def rivercrest_apartments_link(self):
        return self.driver.find_element(*self._rivercrest_apartments_locator)

    @property
    def sidway_building_link(self):
        return self.driver.find_element(*self._sidway_building_locator)

    @property
    def southgate_link(self):
        return self.driver.find_element(*self._southgate_locator)

    @property
    def stone_farm_link(self):
        return self.driver.find_element(*self._stone_farm_locator)

    @property
    def the_landing_link(self):
        return self.driver.find_element(*self._the_landing_locator)

    @property
    def twenty_two_cottages_link(self):
        return self.driver.find_element(*self._twenty_two_cottages_locator)

    @property
    def university_estates_link(self):
        return self.driver.find_element(*self._university_estates_locator)

    @property
    def university_courtyard_link(self):
        return self.driver.find_element(*self._university_courtyard_locator)

    @property
    def university_heights_ii_link(self):
        return self.driver.find_element(*self._university_heights_ii_locator)

    @property
    def university_villages_link(self):
        return self.driver.find_element(*self._university_villages_locator)

    @property
    def willowbrook_west_link(self):
        return self.driver.find_element(*self._willowbrook_west_locator)

    @property
    def wolf_creek_i_link(self):
        return self.driver.find_element(*self._wolf_creek_i_locator)

    @property
    def wolf_creek_ii_link(self):
        return self.driver.find_element(*self._wolf_creek_ii_locator)

    @property
    def add_new_property_button(self):
        return self.driver.find_element(*self._add_new_property_button_locator)

    @property
    def statistics_dashboard_button(self):
        return self.driver.find_element(*self._statistics_dashboard_button_locator)

    @property
    def table_header_property(self):
        return self.driver.find_element(*self._table_header_property_locator)

    @property
    def table_header_total_units(self):
        return self.driver.find_element(*self._table_header_total_units_locator)

    @property
    def table_header_inactive(self):
        return self.driver.find_element(*self._table_header_inactive_locator)

    @property
    def table_header_active(self):
        return self.driver.find_element(*self._table_header_active_locator)

    # property for data for expected results
    @property
    def smartnest_logo_text(self):
        return self._smartnest_logo_text
