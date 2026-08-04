from playwright.sync_api import Page
import re


class DashboardPage:

    def __init__(self, page: Page):

        self.page = page

    logout_button = "button svg"

    def extract_number_from_text(self, card_text):

        # Use regex to find the first occurrence of a number in the text
        match = re.search(r'([\d,]+)', card_text)

        if not match:
            raise ValueError(f"No number found in the provided text: '{card_text}'")
    
        return int(match.group(1).replace(',', ''))  # Remove commas and convert to int
      

    def click_logout_button(self):

        self.page.locator(self.logout_button).last.click()

    total_customers_card = ("text=Total Customers")
    active_accounts_card = ("text=Active Accounts")
    active_loans_card = ("text=Active Loans")

    def get_total_customers(self):

        card_text = self.page.locator(self.total_customers_card).locator("..").inner_text()

        print(f"Total Customers card text: {card_text}")

        return self.extract_number_from_text(card_text)

    def get_active_accounts(self):

        card_text = self.page.locator(self.active_accounts_card).locator("..").inner_text()

        print(f"Active Accounts card text: {card_text}")

        return self.extract_number_from_text(card_text)


    def get_active_loans(self):

        card_text = self.page.locator(self.active_loans_card).locator("..").inner_text()

        print(f"Active Loans card text: {card_text}")

        return self.extract_number_from_text(card_text)