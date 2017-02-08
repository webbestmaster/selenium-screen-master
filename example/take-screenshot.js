const CWD = __dirname;
const path = require('path');
const Ssm = require('selenium-screen-master');
const ssm = new Ssm();

const jar = require('selenium-server-standalone-jar');
jar.path = path.join(CWD, 'selenium-server-standalone-3.0.1.jar');

const SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;

const server = new SeleniumServer(jar.path, {
    port: 4444
});

const SERVER_URL = 'http://statlex.github.io/';
const WEB_DRIVER_SERVER_URL = 'http://localhost:4444/wd/hub';

let WebDriver = require('selenium-webdriver');
let byCss = WebDriver.By.css;
let driver;

server.start()
    .then(() => {

        driver = new WebDriver
            .Builder()
            .usingServer(WEB_DRIVER_SERVER_URL)
            .withCapabilities({'browserName': 'chrome'})
            .build();

        driver.get(SERVER_URL);
        ssm.setDriver(driver);

// USE like this

        return ssm
            .takeScreenshotOfSelector('#ancient-empire-strike-back')
            .then(image => {
                // image base64
                console.log(image);
            });

// OR like this

        return ssm
            .takeScreenshotOfElement(driver.findElement(byCss('#ancient-empire-strike-back')))
            .then(image => console.log(image));

// OR like this

        return ssm
            .takeScreenshotOfArea(80, 200, 500, 300)
            .then(image => console.log(image));

    })
    .then(() => driver.quit())
    .then(() => server.stop());
