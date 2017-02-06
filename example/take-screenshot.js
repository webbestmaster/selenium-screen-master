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

ssm
    .takeScreenshotOfSelector('#ancient-empire-strike-back', browser)
    .then(image => {
        // image base64
        console.log(image);
    });

// OR

ssm
    .takeScreenshotOfElement(browser.findElement(byCss('#ancient-empire-strike-back')), browser)
    .then(image => console.log(image));

// OR

ssm
    .takeScreenshotOfArea(80, 200, 500, 300, browser)
    .then(image => console.log(image));
