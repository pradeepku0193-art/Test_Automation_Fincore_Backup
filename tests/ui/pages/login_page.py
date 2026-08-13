from playwright.sync_api import Page, expect
import re



class LoginPage:
    
    def __init__(self, page:Page):
        self.page = page

        #Locators
        
    username_input = "[data-testid='login-username-input']"

    password_input = "[data-testid='login-password-input']"

    login_button = "[data-testid='login-submit-btn']"

    login_error = "[data-testid='login-error']"

    login_form = "[data-testid='login-form']"

    #Actions

    def open(self, url):
        self.page.goto(url)
    
    def enter_username(self, username):
        self.page.fill(self.username_input, username)
    
    def enter_password(self, password):
        self.page.fill(self.password_input, password)
    
    def click_login(self):
        self.page.click(self.login_button)
    
    def login(self, username, password):
        self.enter_username(username)
        self.enter_password(password)
        self.click_login()


    @property
    def error_message_locator(self):
        return self.page.locator(
            ".error-message, .alert-danger, .toast-error"
        )

    def get_error_message(self):
        self.error_message_locator.wait_for(state="visible")
        return self.error_message_locator.inner_text()

    def verify_login_error_message(self):

        error_locator = self.page.get_by_text(
            re.compile(
                r"login failed|invalid username or password|authentication failed",
                re.IGNORECASE
            )
        )

        expect(error_locator).to_be_visible(timeout=10000)
    
    
    def is_login_page_loaded(self):

        return self.page.locator(
            self.login_form
        ).is_visible()
    
    def get_username_validation(self):

        return self.page.locator(
            self.username_input
        ).evaluate("(element) => element.validationMessage")
    
    
    def get_password_validation(self):

        return self.page.locator(
            self.password_input
        ).evaluate(
            "(element) => element.validationMessage"
        )
 