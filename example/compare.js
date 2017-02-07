const Ssm = require('selenium-screen-master');
const ssm = new Ssm();


const SERVER_URL = 'http://statlex.github.io/';
const WEB_DRIVER_SERVER_URL = 'http://localhost:4444/wd/hub';

// WARNING
// to COLLECT screenshots use MODE = MODES.COLLECT
// to TEST    screenshots use MODE = MODES.TEST
const MODES = ssm.MODES;
const MODE = MODES[process.env.MODE] || MODES.TEST;

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

        console.log(comparing);

    });

// OR

ssm
    .compareOfElement(driver.findElement(byCss('#ancient-empire-strike-back')), {
        image: 'game.png',
        mode: MODE // see WARNING
    })
    .then(comparing => console.log(comparing));

// OR

ssm
    .compareOfArea(80, 200, 500, 300, {
        image: 'game.png',
        mode: MODE // see WARNING
    })
    .then(comparing => console.log(comparing));
