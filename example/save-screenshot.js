const Ssm = require('selenium-screen-master');
const ssm = new Ssm();

const SERVER_URL = 'http://statlex.github.io/';
const WEB_DRIVER_SERVER_URL = 'http://localhost:4444/wd/hub';

let WebDriver = require('selenium-webdriver');
let byCss = WebDriver.By.css;
let driver = new WebDriver
    .Builder()
    .usingServer(WEB_DRIVER_SERVER_URL)
    .withCapabilities({'browserName': 'chrome'})
    .build();

driver.get(SERVER_URL);

ssm.setDriver(driver);

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
