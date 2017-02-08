const Ssm = require('selenium-screen-master');
const ssm = new Ssm();

const SERVER_URL = 'http://statlex.github.io/';
const WEB_DRIVER_SERVER_URL = 'http://localhost:4444/wd/hub';

// WARNING
// to COLLECT screenshots use MODE = MODE.COLLECT
// to TEST    screenshots use MODE = MODE.TEST
const SSM_MODE = ssm.MODE;
const MODE = SSM_MODE[process.env.MODE] || SSM_MODE.TEST;

let WebDriver = require('selenium-webdriver');
let byCss = WebDriver.By.css;
let driver = new WebDriver
    .Builder()
    .usingServer(WEB_DRIVER_SERVER_URL)
    .withCapabilities({'browserName': 'chrome'})
    .build();

driver.get(SERVER_URL);

ssm.setPathToReferenceFolder('./ssm-ref-folder');
ssm.setDriver(driver);

ssm
    .compareOfSelector('#ancient-empire-strike-back', {
        image: 'game.png',
        mode: MODE // see WARNING
    })
    .then(comparing => {

        // comparing.actual - actual image (base64)

        // comparing.expect - expect image (base64)

        // comparing.different - different of images (base64)

        // comparing.info - comparing info (hasMap)

        console.log(comparing.info);

    });

// OR

ssm
    .compareOfElement(driver.findElement(byCss('#ancient-empire-strike-back')), {
        image: 'game.png',
        mode: MODE // see WARNING
    })
    .then(comparing => console.log(comparing.info));

// OR

ssm
    .compareOfArea(80, 200, 500, 300, {
        image: 'game.png',
        mode: MODE // see WARNING
    })
    .then(comparing => console.log(comparing.info));


driver.quit();
