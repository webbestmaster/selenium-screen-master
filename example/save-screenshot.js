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

ssm.setPathToReferenceFolder('./screenshot');

ssm
    .saveScreenshotOfSelector('#ancient-empire-strike-back', 'saved-screenshot-1.png')
    .then(image => {
        // image base64
        console.log(image);
    });

// OR

ssm
    .saveScreenshotOfElement(driver.findElement(byCss('#ancient-empire-strike-back')), 'saved-screenshot-2.png')
    .then(image => console.log(image));

// OR

ssm
    .saveScreenshotOfArea(80, 200, 500, 300, 'saved-screenshot-3.png')
    .then(image => console.log(image));


driver.quit();
