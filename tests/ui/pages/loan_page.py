from playwright.sync_api import Page

class LoanPage:

    def __init__(self, page: Page):

        self.page = page

    #locators
    loans_menu = "text=Loans"
    status_dropdown = "select:nth-of-type(1)"
    type_dropdown = "select:nth-of-type(2)"
    table_rows = "tbody tr"

    def navigate(self):

        self.page.click(self.loans_menu)

        self.page.wait_for_load_state("networkidle")

    def is_page_loaded(self):

        row_count = self.page.locator(self.table_rows).count()

        print("Row Count:", row_count)

        return row_count > 0

    def loan_table_visible(self):

        return(self.page.locator(self.table_rows).count()>0)

    def select_status(self, status):

        self.page.select_option(self.status_dropdown, label = status)

        self.page.wait_for_timeout(2000)  # Wait for the table to refresh after applying the filter

    def select_type(self, type):
        
        self.page.select_option(self.type_dropdown, label = type)

        self.page.wait_for_timeout(2000)  # Wait for the table to refresh after applying the filter
    
    def get_loan_statuses(self):

        rows = self.page.locator(self.table_rows)

        statuses = []
        for i in range(rows.count()):

            status = rows.nth(i).locator("td").nth(6).inner_text().strip()

            statuses.append(status)

        return statuses
    
    def get_loan_types(self):

        rows = self.page.locator(self.table_rows)

        types = []
        for i in range(rows.count()):

            type = rows.nth(i).locator("td").nth(2).inner_text().strip()

            types.append(type)

        return types

    def open_loan_row(self):

        rows = self.page.locator(self.table_rows)

        rows.first.locator("td").nth(0).click()

        self.page.wait_for_timeout(3000)

        print(f"Loan URL : {self.page.url}", flush=True)
       

    def get_loan_detail_page_text(self):

        return self.page.locator("body").inner_text()

    def loan_detail_visible(self):

        page_text = (self.get_loan_detail_page_text()).lower()

        print(f"Current URL: {self.page.url}",flush=True)

        return all(text in page_text
            for text in [
                "loan information",
                "duration",
                "monthly emi",
                "outstanding amount",
                "interest rate",
                "principal amount"
            ]
        )