
class DashboardPage:

    def __init__(self, page):

        self.page = page

        total_customers_card = ""
        active_accounts_card = ""
        active_loans_card = ""

        def get_total_customers(self):

            return int(
                self.page.locator(self.total_customers_card).inner_text()
            )

        def get_active_accounts(self):

            return int(
                self.page.locator(self.active_accounts_card).inner_text()
            )

        def get_active_loans(self):

            return int(
                self.page.locator(self.active_loans_card).inner_text()
            )