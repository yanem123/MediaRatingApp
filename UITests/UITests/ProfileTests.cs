using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace UITests
{
    public class ProfileTests
    {
        private readonly string _url = "http://localhost:5173";
        WebDriverWait wait;

        public ProfileTests()
        {
        }
        [SetUp]
        public void Setup()
        {

        }

        [Test]
        public void TestDeletingMediaFromProfile()
        {
            ChromeDriver webDriver = new ChromeDriver();
            wait = new WebDriverWait(webDriver, TimeSpan.FromSeconds(10));
            string username = "testUser";
            string password = "test";
            string query = "The Way of Kings";
            string author = "Brandon Sanderson";
            int rating = 5;

            //Step #1
            webDriver.Navigate().GoToUrl(_url);
            webDriver.Manage().Window.Maximize();
            HomePage homePage = new HomePage(webDriver);
            homePage.clickOnHumbergerMenuButton();
            homePage.clickOnLoginButton();
            LoginPage loginPage = new LoginPage(webDriver);
            Thread.Sleep(2000);
            loginPage.fillUsername(username);
            loginPage.fillPassword(password);
            loginPage.clickSubmitButton();
            Thread.Sleep(2000);

            //Step #2
            ProfilePage profilePage = new ProfilePage(webDriver);
            profilePage.clickLogoButton();
            Thread.Sleep(2000);
            homePage.fillSearchBarInput(query);
            homePage.fillAuthorInput(author);
            homePage.setFilter("book");
            homePage.clickSearchButton();
            wait.Until(drv => homePage.getCards());
            Thread.Sleep(2000);

            //Step #3
            homePage.clickRate(1, rating);
            homePage.clickOnHumbergerMenuButton();
            homePage.clickOnProfileButton();
            wait.Until(drv => profilePage.getRatedMedias());
            Thread.Sleep(5000);

            //Step #4
            Assert.That(profilePage.getRatedMedias()[0].Text.Contains(query));
            Assert.That(profilePage.getRatedMedias()[0].Text.Contains(rating.ToString()));

            //Step #5
            profilePage.deleteMedia(1);
            webDriver.SwitchTo().Alert().Accept();
            webDriver.Navigate().Refresh();
            wait.Until(drv => webDriver.FindElement(By.Id("noRatedMedia")));
            webDriver.Quit();
        }
    }
}