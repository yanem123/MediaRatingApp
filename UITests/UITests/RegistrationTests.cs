using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace UITests
{
    public class RegistrationTests
    {
        private readonly string _url = "http://localhost:5173";
        WebDriverWait wait;

        public RegistrationTests()
        {
        }
        [SetUp]
        public void Setup()
        {

        }

        [Test]
        public void TestRegistrationFunction()
        {
            ChromeDriver webDriver = new ChromeDriver();
            wait = new WebDriverWait(webDriver,TimeSpan.FromSeconds(10));
            Random random = new Random();
            string userName = "testUser" + random.Next(1,1000);
            string email = userName + "@test.com";
            string password = "test";

            //Step #1
            webDriver.Navigate().GoToUrl(_url);
            webDriver.Manage().Window.Maximize();
            BasePage basePage = new BasePage(webDriver);
            basePage.clickOnHumbergerMenuButton();
            basePage.clickOnRegistrationButton();

            //Step #2
            RegistrationPage registrationPage = new RegistrationPage(webDriver);
            wait.Until(drv => registrationPage.getUsernameInput());
            registrationPage.fillUsername(userName);
            registrationPage.fillEmail(email);
            registrationPage.fillPassword(password);
            registrationPage.fillConfirmPassword(password);

            //Step #3
            registrationPage.clickSubmitButton();
            wait.Until(drv => basePage.getHomeText());
            webDriver.Quit();
        }

        [Test]
        public void TestRegistrationWithInvalidInput()
        {
            ChromeDriver webDriver = new ChromeDriver();
            wait = new WebDriverWait(webDriver, TimeSpan.FromSeconds(10));
            Random random = new Random();
            string userName = "testUser" + random.Next(1, 1000);
            string email = userName + "@test.com";
            string password = "test";
            string invalidPassword = "asd";

            //Step #1
            webDriver.Navigate().GoToUrl(_url);
            webDriver.Manage().Window.Maximize();
            BasePage basePage = new BasePage(webDriver);
            basePage.clickOnHumbergerMenuButton();
            basePage.clickOnRegistrationButton();

            //Step #2
            RegistrationPage registrationPage = new RegistrationPage(webDriver);
            wait.Until(drv => registrationPage.getUsernameInput());
            registrationPage.fillUsername(userName);
            registrationPage.fillEmail(email);
            registrationPage.fillPassword(password);
            registrationPage.fillConfirmPassword(invalidPassword);

            //Step #3
            registrationPage.clickSubmitButton();
            wait.Until(d => webDriver.FindElement(By.XPath("//p[.='Passwords do not match!']")));
            webDriver.Quit();
        }

    }
}
