using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace UITests
{
    class RegistrationPage : BasePage
    {
        ChromeDriver driver;

        public RegistrationPage(ChromeDriver driver) : base(driver) 
        {
            this.driver = driver;
        }

        public IWebElement getUsernameInput()
        {
            return driver.FindElement(By.Id("userNameInput"));
        }

        public void fillUsername(string username)
        {
            getUsernameInput().Click();
            getUsernameInput().SendKeys(username);
        }
        public IWebElement getEmailInput()
        {
            return driver.FindElement(By.Id("emailInput"));
        }

        public void fillEmail(string email)
        {
            getEmailInput().Click();
            getEmailInput().SendKeys(email);
        }
        public IWebElement getPasswordInput()
        {
            return driver.FindElement(By.Id("passwordInput"));
        }

        public void fillPassword(string password)
        {
            getPasswordInput().Click();
            getPasswordInput().SendKeys(password);
        }
        public IWebElement getConfirmPasswordInput()
        {
            return driver.FindElement(By.Id("confirmPasswordInput"));
        }

        public void fillConfirmPassword(string password)
        {
            getConfirmPasswordInput().Click();
            getConfirmPasswordInput().SendKeys(password);
        }

        public IWebElement getSubmitButton()
        {
            return driver.FindElement(By.Id("submitButton"));
        }

        public void clickSubmitButton()
        {
            getSubmitButton().Click();
        }
    }
}