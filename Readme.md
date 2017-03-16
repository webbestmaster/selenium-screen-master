# Selenium Screen Master

## Install

### Dependencies

This needed only for nodeJs canvas, see more here - https://www.npmjs.com/package/canvas

> Ubuntu: sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++

> OS X: brew install pkg-config cairo libpng jpeg giflib

### How to use

#### Take screenshot of element

```javascript
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
```

#### Save screenshot of element

```javascript
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
```

#### Compare images

```javascript
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
```

#### Helpers

```javascript
// set screen size
ssm.setSize(1024, 768);

// reset properties
ssm.reset();
```

#### Test

1 - Install all dependencies for selenium-screen-master<br />
2 - Install mocha globally

>$ npm i && sudo npm i -g mocha

Run test

>$ npm test

#### Recommendations

Use for test mocha + mochawesome + mochawesome/addContext + chai.<br />
See ./test/test.js and ./test/test.sh as example to create beautiful test report.<br />
To see my solution run tests for this projects.
