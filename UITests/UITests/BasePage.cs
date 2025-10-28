using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace UITests
{
	class BasePage
	{
		ChromeDriver driver;

		public BasePage(ChromeDriver driver)
		{
			this.driver = driver;
		}

		public void clickOnHumbergerMenuButton()
		{
			driver.FindElement(By.Id("hamburgerButton")).Click();
		}

		public void clickOnRegistrationButton()
		{
			driver.FindElement(By.Id("registrationButton")).Click();
		}

        public void clickOnLoginButton()
        {
            driver.FindElement(By.Id("loginButton")).Click();
        }

        public void clickOnLogoutButton()
        {
            driver.FindElement(By.Id("logoutButton")).Click();
        }

        public void clickOnProfileButton()
        {
            driver.FindElement(By.Id("profileButton")).Click();
        }

        public IWebElement getHomeText()
		{
			return driver.FindElement(By.Id("homeText"));
		}

		public IWebElement getLogoButton()
		{
			return driver.FindElement(By.Id("logoButton"));
		}

		public void clickLogoButton()
		{
			getLogoButton().Click();
		}
	}
}