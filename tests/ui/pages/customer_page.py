from playwright.sync_api import Page


class CustomerPage:

    def __init__(self, page: Page):

        self.page = page

    # Navigation

    customers_menu = "text=Customers"

    # Search

    search_box = ("input[placeholder='Search by name or email...']")

    search_button = ("button:has-text('Search')")

    # Filter

    status_dropdown = "select"

    # Table

    table_rows = "tbody tr"

    def navigate(self):

        self.page.click(
            self.customers_menu
        )

        self.page.wait_for_load_state("networkidle")

    def is_page_loaded(self):

        return self.page.locator(self.search_box).is_visible()

    def customer_table_visible(self):

        return (
            self.page.locator(
                self.table_rows
            ).count() > 0
        )

    def search_customer(self,customer_name):

        self.page.fill(self.search_box,customer_name)

        self.page.click(self.search_button)

    def get_customer_names(self):

        rows = self.page.locator(self.table_rows)

        names = []

        for i in range(rows.count()):

            names.append(rows.nth(i)
                .locator("td")
                .nth(1)
                .inner_text()
            )

        return names

    def filter_status(self,status):

        self.page.select_option(self.status_dropdown,label=status)

    def get_visible_statuses(self):

        rows = self.page.locator(self.table_rows)

        statuses = []

        for i in range(rows.count()):

            statuses.append(
                rows.nth(i)
                .locator("td")
                .nth(3)
                .inner_text()
            )

        return statuses

    def open_first_customer(self):

        self.page.locator(self.table_rows).first.click()

    def customer_detail_visible(self):

        return (
            "customer"
            in self.page.url.lower()
        )