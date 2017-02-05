const Ssm = require('selenium-screen-master');
const ssm = new Ssm();

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

// also see .takeScreenshotBySelector(browser, selector)
ssm.takeScreenshotOfElement(browser, browser.findElement(byCss('#ancient-empire-strike-back')))
    .then(image => {
        // image base64
        console.log(image);
    })
    .then(() => browser.quit());
