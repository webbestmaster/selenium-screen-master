# Selenium Screen Master

## Install

### Dependencies

This needed only for nodeJs canvas, see more here - https://www.npmjs.com/package/canvas

> Ubuntu: sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++

> OS X: brew install pkg-config cairo libpng jpeg giflib

### How to use

#### Take screenshot of element
```javascript
let webdriver = require('selenium-webdriver');
let byCss = webdriver.By.css;
let browser = new webdriver
    .Builder()
    .usingServer(WEB_DRIVER_SERVER_URL)
    .withCapabilities({'browserName': 'chrome'})
    .build();

const Ssm = require('selenium-screen-master');
const ssm = new Ssm();

//... some code ...

ssm
    .takeScreenshotOfElement(browser, browser.findElement(byCss('your_css_selector')))
    .then(image => {
        // image base64
        console.log(image);
    })
```
#### Compare images

```javascript
let webdriver = require('selenium-webdriver');
let byCss = webdriver.By.css;
let browser = new webdriver
    .Builder()
    .usingServer(WEB_DRIVER_SERVER_URL)
    .withCapabilities({'browserName': 'chrome'})
    .build();

const Ssm = require('selenium-screen-master');
const ssm = new Ssm();

// WARNING
// to COLLECT screenshots use MODE = MODES.COLLECT
// to TEST    screenshots use MODE = MODES.TEST
const MODES = ssm.MODES;
const MODE = MODES[process.env.MODE] || MODES.COLLECT;

ssm.setPathToReferenceFolder('./ssm-ref-folder');

//... some code ...

ssm
    .compare({
        browser: browser,
        element: browser.findElement(byCss('your_css_selector')),
        image: 'my-image-name.png',
        mode: MODE // see WARNING
    })
    .then(comparing => {

        // comparing.actual - actual image (base64)

        // comparing.expect - expect image (base64)

        // comparing.different - different of images (base64)

        // comparing.info - comparing info (hasMap)

        console.log(comparing);

    })

```
