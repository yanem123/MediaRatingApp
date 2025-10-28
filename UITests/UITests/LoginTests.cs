using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace UITests
{
    public class LoginTests
    {
        private readonly string _url = "http://localhost:5173";
        WebDriverWait wait;

        public LoginTests()
        {
        }
        [SetUp]
        public void Setup()
        {

        }

        [Test]
        public void TestLoginFunction()
        {
            ChromeDriver webDriver = new ChromeDriver();
            wait = new WebDriverWait(webDriver, TimeSpan.FromSeconds(10));
            string userName = "admin";
            string password = "admin";

            //Step #1
            webDriver.Navigate().GoToUrl(_url);
            webDriver.Manage().Window.Maximize();
            BasePage basePage = new BasePage(webDriver);
            basePage.clickOnHumbergerMenuButton();
            basePage.clickOnLoginButton();

            //Step #2
            LoginPage loginPage = new LoginPage(webDriver);
            wait.Until(drv => loginPage.getUsernameInput());
            loginPage.fillUsername(userName);
            loginPage.fillPassword(password);

            //Step #3
            loginPage.clickSubmitButton();
            ProfilePage profilePage = new ProfilePage(webDriver);
            wait.Until(drv => profilePage.getProfileText());
            webDriver.Quit();

        }

        [Test]
        public void TestLoginWithInvalidInput()
        {
            ChromeDriver webDriver = new ChromeDriver();
            wait = new WebDriverWait(webDriver, TimeSpan.FromSeconds(10));
            string userName = "admin";
            string password = "badPassword";

            //Step #1
            webDriver.Navigate().GoToUrl(_url);
            webDriver.Manage().Window.Maximize();
            BasePage basePage = new BasePage(webDriver);
            basePage.clickOnHumbergerMenuButton();
            basePage.clickOnLoginButton();

            //Step #2
            LoginPage loginPage = new LoginPage(webDriver);
            wait.Until(drv => loginPage.getUsernameInput());
            loginPage.fillUsername(userName);
            loginPage.fillPassword(password);

            //Step #3
            loginPage.clickSubmitButton();
            wait.Until(drv => webDriver.FindElement(By.XPath("//p[.='Login unsuccessful. Invalid credentials.']")));
            webDriver.Quit();
        }
    }
}
