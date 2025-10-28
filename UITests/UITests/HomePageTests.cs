using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace UITests
{
    public class HomePageTests
    {
        private readonly string _url = "http://localhost:5173";
        WebDriverWait wait;

        public HomePageTests()
        {
        }
        [SetUp]
        public void Setup()
        {

        }

        [Test]
        public void TestSearchFunctionWithFilters()
        {
            ChromeDriver webDriver = new ChromeDriver();
            wait = new WebDriverWait(webDriver, TimeSpan.FromSeconds(10));
            string query = "The Lord of The Rings";
            int yearFrom = 2002;

            //Step #1
            webDriver.Navigate().GoToUrl(_url);
            webDriver.Manage().Window.Maximize();
            HomePage homePage = new HomePage(webDriver);
            wait.Until(drv => homePage.getHomeText());

            //Step #2
            homePage.fillSearchBarInput(query);
            homePage.fillYearFromInput(yearFrom);
            homePage.setFilter("movie");

            //Step #3
            homePage.clickSearchButton();
            wait.Until(drv =>homePage.getCards());
            Thread.Sleep(2000);
            Assert.That(homePage.getCards().Count(), Is.EqualTo(6));
            webDriver.Quit();
        }

        [Test]
        public void TestRatingFunctionWithoutLogin()
        {
            ChromeDriver webDriver = new ChromeDriver();
            wait = new WebDriverWait(webDriver, TimeSpan.FromSeconds(10));
            string query = "The Lord of The Rings";
            int yearFrom = 2002;

            //Step #1
            webDriver.Navigate().GoToUrl(_url);
            webDriver.Manage().Window.Maximize();
            HomePage homePage = new HomePage(webDriver);
            wait.Until(drv => homePage.getHomeText());

            //Step #2
            homePage.fillSearchBarInput(query);
            homePage.fillYearFromInput(yearFrom);
            homePage.setFilter("movie");
            homePage.clickSearchButton();
            wait.Until(drv => homePage.getCards());
            Thread.Sleep(2000);

            //Step #3
            homePage.clickRate(1, 5);
            Assert.That(webDriver.SwitchTo().Alert().Text == "Please log in to rate!");
            webDriver.SwitchTo().Alert().Accept();
            webDriver.Quit();
        }
    }
}