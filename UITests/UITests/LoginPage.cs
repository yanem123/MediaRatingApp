using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace UITests
{
    class LoginPage : BasePage
    {
        ChromeDriver driver;

        public LoginPage(ChromeDriver driver) : base(driver)
        {
            this.driver = driver;
        }

        public IWebElement getUsernameInput()
        {
            return driver.FindElement(By.Id("usernameInput"));
        }

        public void fillUsername(string username)
        {
            getUsernameInput().Click();
            getUsernameInput().SendKeys(username);
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