/**
 * Selenium Screen Master
 * Help you create screenshots and compare they
 */

/*
 WARNING! At first install libraries for nodeJs canvas
 Ubuntu: sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
 OS X: brew install pkg-config cairo libpng jpeg giflib
 */

// external modules
const webdriver = require('selenium-webdriver');
const Canvas = require('canvas');
const resemble = require('node-resemble');

// system modules
const path = require('path');
const fs = require('fs');

const byCss = webdriver.By.css;

const Image = Canvas.Image;
const BASE64_IMAGE_PREFIX = 'data:image/png;base64,';

const MODES = {
    TEST: 'TEST',
    COLLECT: 'COLLECT'
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
        this.MODES = MODES;

        /**
         * Default parameters
         * @private
         * @type {Object}
         */
        this._attr = {
            pathToReferenceFolder: ''
        };

    }

    /**
     * Set folder to save collected images
     * @public
     * @param {string} pathToReferenceFolder - path to reference folder
     * @return undefined
     */
    setPathToReferenceFolder(pathToReferenceFolder) {
        this._attr.pathToReferenceFolder = pathToReferenceFolder;
    }

    /**
     * Get path to reference folder
     * @return {string}
     * @public
     */
    getPathToReferenceFolder() {
        return this._attr.pathToReferenceFolder;
    }

    /**
     * Compare images
     * @public
     * @param {string} selector - usual css selector
     * @param {Selenium Web Driver Instance} data.browser
     * @param {string} data.image - path/to/your/image.png
     * @param {string} data.mode - mode of comparing - 'COLLECT' or 'TEST'
     * @return {Promise} will resolve with comparing data
     */
    compareOfSelector(selector, data) {
        return this.compareOfElement(data.browser.findElement(byCss(selector)), data);
    }

    /**
     * Compare images
     * @public
     * @param {Selenium Web Driver HTMLElement} element
     * @param {Selenium Web Driver Instance} data.browser
     * @param {string} data.image - path/to/your/image.png
     * @param {string} data.mode - mode of comparing - 'COLLECT' or 'TEST'
     * @return {Promise} will resolve with comparing data
     */
    compareOfElement(element, data) {

        return Promise
            .all([
                element.getLocation(),
                element.getSize()
            ])
            .then(dataList => {

                let location = dataList[0],
                    size = dataList[1];

                return this.compareOfArea(location.x, location.y, size.width, size.height, data)

            });
    }

    /**
     * Compare images
     * @public
     * @params {numbers} x, y, width, height - area's location
     * @param {Selenium Web Driver Instance} data.browser
     * @param {string} data.image - path/to/your/image.png
     * @param {string} data.mode - mode of comparing - 'COLLECT' or 'TEST'
     * @return {Promise} will resolve with comparing data
     */
    compareOfArea(x, y, width, height, data) {

        const ssm = this;

        const {browser, image} = data;

        const mode = data.mode || MODES.TEST;

        const pathToImage = path.join(ssm.getPathToReferenceFolder(), image);

        let actualImage, expectImage;

        return ssm
            .takeScreenshotOfArea(x, y, width, height, browser)
            .then(image => {

                actualImage = image;

                switch (mode) {
                    case MODES.TEST:
                        return pngToBase64(pathToImage).then(image => expectImage = image);
                        break;
                    case MODES.COLLECT:
                        return writeBase64ToFile(pathToImage, image);
                        break;
                    default:
                        throw mode + ' - invalid compare mode!'

                }
            })
            .then(() => compareImages(actualImage, expectImage || actualImage));

    }


    /**
     *
     * @param {string} selector - usual css selector
     * @param {Selenium Web Driver Instance} browser
     * @return {Promise} with resolve base64 image
     */
    takeScreenshotOfSelector(selector, browser) {
        return takeScreenshotOfElement(browser.findElement(byCss(selector)), browser);
    }

    /**
     *
     * @public
     * @param {Selenium Web Driver HTMLElement} element
     * @param {Selenium Web Driver Instance} browser
     * @return {Promise} with resolve base64 image
     */
    takeScreenshotOfElement(element, browser) {
        return takeScreenshotOfElement(element, browser);
    }

    /**
     *
     * @public
     * @params {numbers} x, y, width, height - area's location
     * @param {Selenium Web Driver Instance} browser
     * @return {Promise} with resolve base64 image
     */
    takeScreenshotOfArea(x, y, width, height, browser) {
        return takeScreenshotOfArea(x, y, width, height, browser);
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
        resemble(actualImage).compareTo(expectImage).onComplete(data =>
            resolve({
                actual: actualImage,
                expect: expectImage,
                different: data.getImageDataUrl(),
                info: data
            })
        )
    );

}

function takeScreenshotOfElement(element, browser) {

    return Promise
        .all([
            element.getLocation(),
            element.getSize()
        ])
        .then(dataList => {

            let location = dataList[0],
                size = dataList[1];

            return takeScreenshotOfArea(location.x, location.y, size.width, size.height, browser)

        });

}

function getScrollTop(browser) {
    return browser
        .executeScript('return document.body.scrollTop')
        .then(scrollSize => parseInt(scrollSize, 10));
}

function getScrollLeft(browser) {
    return browser
        .executeScript('return document.body.scrollLeft')
        .then(scrollSize => parseInt(scrollSize, 10));
}

// return promise with REAL scroll position
function setScrollTop(scrollSize, browser) {
    return browser
        .executeScript('document.body.scrollTop = ' + scrollSize)
        .then(() => getScrollTop(browser));
}

function setScrollLeft(scrollSize, browser) {
    return browser
        .executeScript('document.body.scrollLeft = ' + scrollSize)
        .then(() => getScrollLeft(browser));
}

function takeScreenshotOfArea(x, y, width, height, browser) {

    x = x || 0;
    y = y || 0;

    let currentScrollTop,
        currentScrollLeft;

    return Promise
        .all([
            setScrollTop(y, browser),
            setScrollLeft(x, browser)
        ])
        .then(dataList => {
            currentScrollTop = dataList[0];
            currentScrollLeft = dataList[1];

            return browser.takeScreenshot();

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
