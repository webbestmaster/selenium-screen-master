/**
 * Selenium Screen Master
 * Help you create screenshots and compare they
 */

/*
 WARNING! At first install libraries for nodeJs canvas
 Ubuntu: sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
 OS X: brew install pkg-config cairo libpng jpeg giflib
 */

/*global WebDriverHTMLElement*/

// external modules
const WebDriver = require('selenium-webdriver');
const Canvas = require('canvas');
const resemble = require('node-resemble');

// system modules
const path = require('path');
const fs = require('fs');

const byCss = WebDriver.By.css;

const Image = Canvas.Image;
const BASE64_IMAGE_PREFIX = 'data:image/png;base64,';

const MODE = {
    TEST: 'TEST',
    COLLECT: 'COLLECT'
};

const CONSTANT = {
    WAIT: {
        SCREENSHOT: 5e3
    }
};

class Ssm {

    /**
     * Constructor of class (c) Captain Obvious
     */
    constructor() {

        /**
         * Available modes
         * @public
         * @type {Object}
         */
        this.MODE = MODE;

        /**
         * Constants
         * @public
         * @type {Object}
         */
        this.CONSTANT = CONSTANT;

        /**
         * Default parameters
         * @private
         * @type {Object}
         */
        this._attr = {
            pathToReferenceFolder: '',
            driver: null
        };

    }

    /**
     * Set folder to save collected images
     * @public
     * @param {string} pathToReferenceFolder - path to reference folder
     * @return void
     */
    setPathToReferenceFolder(pathToReferenceFolder) {
        this._attr.pathToReferenceFolder = pathToReferenceFolder;
    }

    /**
     * Get path to reference folder
     * @public
     * @return {string}
     */
    getPathToReferenceFolder() {
        return this._attr.pathToReferenceFolder;
    }

    /**
     * @public
     * @param {WebDriver} driver
     * @return void
     */
    setDriver(driver) {
        this._attr.driver = driver;
    }

    /**
     * @public
     * @return {WebDriver}
     */
    getDriver() {
        return this._attr.driver;
    }

    /**
     * Compare images
     * @public
     * @param {string} selector - usual css selector
     * @param {string} data.image - path/to/your/image.png
     * @param {string} data.mode - mode of comparing - 'COLLECT' or 'TEST'
     * @return {promise} will resolve with comparing data
     */
    compareOfSelector(selector, data) {

        const ssm = this;
        const driver = ssm.getDriver();

        return driver.wait(
            ssm.compareOfElement(driver.findElement(byCss(selector)), data),
            ssm.CONSTANT.WAIT.SCREENSHOT
        );

    }

    /**
     * Compare images
     * @public
     * @param {WebDriverHTMLElement} element
     * @param {string} data.image - path/to/your/image.png
     * @param {string} data.mode - mode of comparing - 'COLLECT' or 'TEST'
     * @return {promise} will resolve with comparing data
     */
    compareOfElement(element, data) {

        const ssm = this;
        const driver = ssm.getDriver();

        return driver.wait(
            Promise
                .all([
                    element.getLocation(),
                    element.getSize()
                ])
                .then(dataList => {

                    let location = dataList[0],
                        size = dataList[1];

                    return ssm.compareOfArea(location.x, location.y, size.width, size.height, data)

                }),
            ssm.CONSTANT.WAIT.SCREENSHOT
        );

    }

    /**
     * Compare images
     * @public
     * @params {numbers} x, y, width, height - area's location
     * @param {string} data.image - path/to/your/image.png
     * @param {string} data.mode - mode of comparing - 'COLLECT' or 'TEST'
     * @return {promise} will resolve with comparing data
     */
    compareOfArea(x, y, width, height, data) {

        const ssm = this;

        const driver = ssm.getDriver();

        const image = data.image;

        const mode = data.mode || MODE.TEST;

        const pathToImage = path.join(ssm.getPathToReferenceFolder(), image);

        let actualImage, expectImage;

        return driver.wait(
            ssm
                .takeScreenshotOfArea(x, y, width, height)
                .then(image => {

                    actualImage = image;

                    switch (mode) {
                        case MODE.TEST:
                            return pngToBase64(pathToImage).then(image => expectImage = image);
                            break;
                        case MODE.COLLECT:
                            return writeBase64ToFile(pathToImage, image);
                            break;
                        default:
                            throw mode + ' - invalid compare mode!'

                    }
                })
                .then(() => compareImages(actualImage, expectImage || actualImage)),
            ssm.CONSTANT.WAIT.SCREENSHOT
        );

    }

    /**
     *
     * @public
     * @param {string} selector - usual css selector
     * @return {promise} will resolve with resolve base64 image
     */
    takeScreenshotOfSelector(selector) {
        const ssm = this;
        const driver = ssm.getDriver();
        return driver.wait(
            takeScreenshotOfElement(driver.findElement(byCss(selector)), driver),
            ssm.CONSTANT.WAIT.SCREENSHOT
        )
    }

    /**
     *
     * @public
     * @param {WebDriverHTMLElement} element
     * @return {promise} will resolve with resolve base64 image
     */
    takeScreenshotOfElement(element) {
        const ssm = this;
        const driver = ssm.getDriver();
        return driver.wait(
            takeScreenshotOfElement(element, driver),
            ssm.CONSTANT.WAIT.SCREENSHOT
        )
    }

    /**
     *
     * @public
     * @params {numbers} x, y, width, height - area's location
     * @return {promise} will resolve with resolve base64 image
     */
    takeScreenshotOfArea(x, y, width, height) {
        const ssm = this;
        const driver = ssm.getDriver();
        return driver.wait(
            takeScreenshotOfArea(x, y, width, height, driver),
            ssm.CONSTANT.WAIT.SCREENSHOT
        )
    }

    /**
     *
     * @public
     * @param {string} selector - usual css selector
     * @param {string} pathToImage
     * @return {promise} will resolve with resolve base64 image
     */
    saveScreenshotOfSelector(selector, pathToImage) {

        const ssm = this;
        const driver = ssm.getDriver();
        const endPathToImage = path.join(ssm.getPathToReferenceFolder(), pathToImage);

        return driver.wait(
            ssm
                .takeScreenshotOfSelector(selector)
                .then(image =>
                    writeBase64ToFile(endPathToImage, image)
                        .then(() => image)
                ),
            ssm.CONSTANT.WAIT.SCREENSHOT
        )

    }

    /**
     *
     * @public
     * @param {WebDriverHTMLElement} element
     * @param {string} pathToImage
     * @return {promise} will resolve with resolve base64 image
     */
    saveScreenshotOfElement(element, pathToImage) {

        const ssm = this;
        const driver = ssm.getDriver();
        const endPathToImage = path.join(ssm.getPathToReferenceFolder(), pathToImage);

        return driver.wait(
            ssm
                .takeScreenshotOfElement(element)
                .then(image =>
                    writeBase64ToFile(endPathToImage, image)
                        .then(() => image)
                ),
            ssm.CONSTANT.WAIT.SCREENSHOT
        )

    }

    /**
     *
     * @public
     * @params {numbers} x, y, width, height - area's location
     * @param {string} pathToImage
     * @return {promise} will resolve with resolve base64 image
     */
    saveScreenshotOfArea(x, y, width, height, pathToImage) {

        const ssm = this;
        const driver = ssm.getDriver();
        const endPathToImage = path.join(ssm.getPathToReferenceFolder(), pathToImage);

        return driver.wait(
            ssm
                .takeScreenshotOfArea(x, y, width, height)
                .then(image =>
                    writeBase64ToFile(endPathToImage, image)
                        .then(() => image)
                ),
            ssm.CONSTANT.WAIT.SCREENSHOT
        )

    }

    /**
     *
     * @public
     */
    reset() {
        this._attr = {};
    }

}

module.exports = Ssm;

// helpers
function readFile(pathToFile) {
    return new Promise((resolve, reject) =>
        fs.readFile(pathToFile, (err, data) =>
            err ? reject(err) : resolve(data)
        )
    );
}

function pngToBase64(pathToImage) {
    return readFile(pathToImage).then(data => BASE64_IMAGE_PREFIX + data.toString('base64'));
}

function writeBase64ToFile(pathForImage, base64String) {

    return new Promise((resolve, reject) =>
        fs.writeFile(
            pathForImage,
            base64String.replace(BASE64_IMAGE_PREFIX, ''),
            'base64',
            err => err ? reject() : resolve()
        )
    );

}

function compareImages(actualImage, expectImage) {

    return new Promise((resolve, reject) =>
        resemble(actualImage).compareTo(expectImage).onComplete(data => {
                data.misMatchPercentage = parseFloat(data.misMatchPercentage);
                resolve({
                    actual: actualImage,
                    expect: expectImage,
                    different: data.getImageDataUrl(),
                    info: data
                })
            }
        )
    );

}

function takeScreenshotOfElement(element, driver) {
    return Promise
        .all([
            element.getLocation(),
            element.getSize()
        ])
        .then(dataList => {

            let location = dataList[0],
                size = dataList[1];

            return takeScreenshotOfArea(location.x, location.y, size.width, size.height, driver)

        });

}

function getScrollTop(driver) {
    return driver
        .executeScript('return document.body.scrollTop')
        .then(scrollSize => parseInt(scrollSize, 10));
}

function getScrollLeft(driver) {
    return driver
        .executeScript('return document.body.scrollLeft')
        .then(scrollSize => parseInt(scrollSize, 10));
}

// return promise with REAL scroll position
function setScrollTop(scrollSize, driver) {
    return driver
        .executeScript('document.body.scrollTop = ' + scrollSize)
        .then(() => getScrollTop(driver));
}

function setScrollLeft(scrollSize, driver) {
    return driver
        .executeScript('document.body.scrollLeft = ' + scrollSize)
        .then(() => getScrollLeft(driver));
}

function takeScreenshotOfArea(x, y, width, height, driver) {

    x = x || 0;
    y = y || 0;

    let currentScrollTop,
        currentScrollLeft;

    return Promise
        .all([
            setScrollTop(y, driver),
            setScrollLeft(x, driver)
        ])
        .then(dataList => {

            currentScrollTop = dataList[0];
            currentScrollLeft = dataList[1];

            return driver.takeScreenshot();

        })
        .then(image => {

            let deltaScrollTop = y - currentScrollTop,
                deltaScrollLeft = x - currentScrollLeft,
                canvas = new Canvas(width, height),
                ctx = canvas.getContext('2d'),
                img = new Image();

            img.src = BASE64_IMAGE_PREFIX + image;

            ctx.drawImage(img, -deltaScrollLeft, -deltaScrollTop, img.width, img.height);

            return canvas.toDataURL();

        });

}
