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
     * Compare images
     * @public
     * @param data
     * @param {Selenium Web Driver Instance} data.browser
     * @param {Selenium Web Driver HTMLElement} data.element
     * @param {string} data.image - path/to/your/image.png
     * @param {string} data.mode - mode of comparing - 'COLLECT' or 'TEST'
     * @return {Promise} will resolve with comparing data
     */
    compare(data) {

        const {browser, element, image} = data;

        const mode = data.mode || MODES.TEST;

        const ssm = this;

        const pathToImage = path.join(ssm.getPathToReferenceFolder(), image);

        let actualImage, expectImage;

        return ssm
            .takeScreenshotOfElement(browser, element)
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
     * Set folder to save collected images
     * @public
     * @param {string} path to reference folder
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
     *
     * @public
     * @param {Selenium Web Driver Instance} browser
     * @param {Selenium Web Driver HTMLElement} element
     * @return {Promise} with resolve base64 image
     */
    takeScreenshotOfElement(browser, element) {
        return takeScreenshotOfElement(browser, element);
    }

    /**
     * See Ssm.takeScreenshotOfElement
     * @param {Selenium Web Driver Instance} browser
     * @param {string} selector
     * @return {Promise} with resolve base64 image
     */
    takeScreenshotBySelector(browser, selector) {
        return this.takeScreenshotOfElement(browser, browser.findElement(byCss(selector)));
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

function takeScreenshotOfElement(browser, element) {

    let location, size;

    return Promise
        .all([
            element.getLocation(),
            element.getSize()
        ])
        .then(data => {
            location = data[0];
            size = data[1];
            return browser.executeScript('scroll(0, ' + location.y + ')');
        })
        .then(() => browser.takeScreenshot())
        .then(image => {

            let canvas = new Canvas(size.width, size.height),
                ctx = canvas.getContext('2d'),
                img = new Image();

            img.src = BASE64_IMAGE_PREFIX + image;

            ctx.drawImage(img, -location.x, 0, img.width, img.height);

            return canvas.toDataURL();

        });

}
