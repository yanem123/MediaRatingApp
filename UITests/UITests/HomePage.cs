using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace UITests
{
    class HomePage : BasePage
    {
        ChromeDriver driver;

        public HomePage(ChromeDriver driver) : base(driver)
        {
            this.driver = driver;
        }
        
        public IWebElement getSearchBarInput()
        {
            return driver.FindElement(By.Id("searchInput"));
        }

        public void fillSearchBarInput(string query)
        {
            getSearchBarInput().Clear();
            getSearchBarInput().Click();
            getSearchBarInput().SendKeys(query);
        }

        public IWebElement getAuthorInput() {
            return driver.FindElement(By.Id("authorInput"));
        }

        public void fillAuthorInput(string author)
        {
            getAuthorInput().Clear();
            getAuthorInput().Click();
            getAuthorInput().SendKeys(author);
        }

        public IWebElement getYearFromInput()
        {
            return driver.FindElement(By.Id("yearFromInput"));
        }
        public IWebElement getYearToInput()
        {
            return driver.FindElement(By.Id("yearToInput"));
        }

        public void fillYearFromInput(int number)
        {
            getYearFromInput().SendKeys(number.ToString());
        }

        public void fillYearToInput(int number)
        {
            getYearToInput().SendKeys(number.ToString());
        }

        public SelectElement getFilter()
        {
            SelectElement select = new SelectElement(driver.FindElement(By.Id("filter")));
            return select;
        }

        public void setFilter(string value) {
            getFilter().SelectByValue(value);
        }

        public IWebElement getSearchButton()
        {
            return driver.FindElement(By.Id("searchButton"));
        }

        public void clickSearchButton()
        {
            getSearchButton().Click();
        }

        public IList<IWebElement> getCards()
        {
            return driver.FindElements(By.CssSelector("div.card"));
        }

        public void clickRate(int cardIndex, int rating)
        {
            getCards()[cardIndex-1].FindElement(By.XPath("//label[.='"+rating+" Stars']")).Click();
        }
    }
}