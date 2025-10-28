using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace UITests
{
    class ProfilePage : BasePage
    {
        ChromeDriver driver;

        public ProfilePage(ChromeDriver driver) : base(driver)
        {
            this.driver = driver;
        }

        public IWebElement getProfileText()
        {
            return driver.FindElement(By.Id("profileText"));
        }

        public IList<IWebElement> getRatedMedias()
        {
            return driver.FindElements(By.CssSelector("li.ratedMedia"));
        }

        public void deleteMedia(int index)
        {
            getRatedMedias()[index-1].FindElement(By.CssSelector("button.deleteButton")).Click();
        }
    }
}