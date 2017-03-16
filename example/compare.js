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
// WARNING
// to COLLECT screenshots use MODE = MODE.COLLECT
// to TEST    screenshots use MODE = MODE.TEST
const MODE = ssm.MODE;
ssm.setMode(MODE[process.env.MODE] || MODE.TEST);

ssm.setSize(1024, 768);

ssm
    .compareOfSelector('#ancient-empire-strike-back', 'game.png')
    .then(comparing => {

        // comparing.actual - actual image (base64)

        // comparing.expect - expect image (base64)

        // comparing.different - different of images (base64)

        // comparing.info - comparing info (hasMap)

        console.log(comparing.info);

    });

// OR

ssm
    .compareOfElement(driver.findElement(byCss('#ancient-empire-strike-back')), 'game.png')
    .then(comparing => console.log(comparing.info));

// OR

ssm
    .compareOfArea(80, 200, 500, 300, 'game.png')
    .then(comparing => console.log(comparing.info));

driver.quit();
