const Ssm = require('selenium-screen-master');

const SERVER_URL = 'http://statlex.github.io/';
const WEB_DRIVER_SERVER_URL = 'http://localhost:4444/wd/hub';

const WebDriver = require('selenium-webdriver');
const byCss = WebDriver.By.css;
const driver = new WebDriver
    .Builder()
    .usingServer(WEB_DRIVER_SERVER_URL)
    .withCapabilities({'browserName': 'chrome'})
    .build();

driver.get(SERVER_URL);

const ssm = new Ssm();

ssm.setPathToReferenceFolder('./ssm-ref-folder');
ssm.setDriver(driver);
ssm.setSize(1024, 768);

ssm
    .takeScreenshotOfSelector('#ancient-empire-strike-back')
    .then(image => {
        // image base64
        console.log(image);
    });

// OR

ssm
    .takeScreenshotOfElement(driver.findElement(byCss('#ancient-empire-strike-back')))
    .then(image => console.log(image));

// OR

ssm
    .takeScreenshotOfArea(80, 200, 500, 300)
    .then(image => console.log(image));


driver.quit();
