from datetime import datetime


class TransactionPage:

    def __init__(self, page):

        self.page = page

    # Navigation

    transactions_menu = "text=Transactions"

    # Filters

    type_dropdown = "select:nth-of-type(1)"

    status_dropdown = "select:nth-of-type(2)"

    date_inputs = "input"

    apply_filter_btn = ("button:has-text('Apply Filters')")

    clear_btn = ("button:has-text('Clear')")

    # Table

    table_rows = "tbody tr"

    def navigate(self):

        self.page.click(self.transactions_menu)

        self.page.wait_for_load_state("networkidle")

    def select_transaction_type(self,txn_type):

        self.page.select_option(self.type_dropdown,label=txn_type)

        self.page.click(self.apply_filter_btn)

    def apply_date_filter(self,from_date,to_date):

        date_boxes = self.page.locator(self.date_inputs)

        date_boxes.nth(0).fill(from_date)

        date_boxes.nth(1).fill(to_date)

        self.page.click(self.apply_filter_btn)

    def clear_filters(self):

        self.page.click(self.clear_btn)

    def apply_sample_filters(self):

        """Used by Clear Filters scenario."""
        self.select_transaction_type("Credit")

    def get_transaction_types(self):

        rows = self.page.locator(self.table_rows)

        values = []

        for i in range(rows.count()):

            values.append(rows.nth(i).locator("td").nth(3).inner_text())

        return values

    def get_transaction_dates(self):

        rows = self.page.locator(self.table_rows)

        dates = []

        for i in range(rows.count()):

            date_text = (rows.nth(i).locator("td").nth(1).inner_text())

            dates.append(date_text)

        return dates

    #def get_amounts(self):

        #rows = self.page.locator(
            #self.table_rows
        #)

        #amounts = []

        #for i in range(
                #rows.count()):

            #value = (rows.nth(i).locator("td").nth(4).inner_text())

            #amounts.append(value)

        #return amounts

    def filters_cleared(self):

        type_value = (self.page.locator(self.type_dropdown).input_value())

        print(f"Type dropdown after clear = {type_value}")

        return (type_value == ""or type_value.lower() in ["all","all types"])
    
    def get_row_count(self):
        return (self.page.locator(self.table_rows).count())