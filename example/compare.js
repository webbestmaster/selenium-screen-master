const Ssm = require('selenium-screen-master');
const ssm = new Ssm();
const MODES = ssm.MODES;

ssm.setPathToReferenceFolder('./ssm-ref-folder');

// WARNING
// to COLLECT screenshots use MODE = MODES.COLLECT
// to TEST    screenshots use MODE = MODES.TEST
const MODE = MODES[process.env.MODE] || MODES.TEST;

let SERVER_URL = 'http://statlex.github.io/';
let WEB_DRIVER_SERVER_URL = 'http://localhost:4444/wd/hub';

let webdriver = require('selenium-webdriver');
let byCss = webdriver.By.css;
let browser = new webdriver
    .Builder()
    .usingServer(WEB_DRIVER_SERVER_URL)
    .withCapabilities({'browserName': 'chrome'})
    .build();

browser.get(SERVER_URL);

ssm
    .compareOfSelector('#ancient-empire-strike-back', {
        browser: browser,
        image: 'game.png',
        mode: MODES.TEST // see WARNING
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
    .compareOfElement(browser.findElement(byCss('#ancient-empire-strike-back')), {
        browser: browser,
        image: 'game.png',
        mode: MODES.TEST // see WARNING
    })
    .then(comparing => console.log(comparing));

// OR

ssm
    .compareOfArea(80, 200, 500, 300, {
        browser: browser,
        image: 'game.png',
        mode: MODES.TEST // see WARNING
    })
    .then(comparing => console.log(comparing));
