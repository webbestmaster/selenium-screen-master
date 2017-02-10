/*global describe, it, beforeEach, afterEach */

"use strict";

const resemble = require('node-resemble');
const fs = require('fs');

const Ssm = require('./../index');

const assert = require('chai').assert;
const util = require('./test-util');

const addContext = require('mochawesome/addContext');

const SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;

const PORT = 4444;
const OS_NAME = util.detectOsName();

const SITE_URL = 'http://statlex.github.io/';
const WEB_DRIVER_SERVER_URL = 'http://localhost:' + PORT + '/wd/hub';

const server = new SeleniumServer('./driver/selenium-server-standalone-3.0.1.jar', {
    port: PORT,
    jvmArgs: ['-Dwebdriver.chrome.driver=./driver/' + OS_NAME + '/chromedriver']
});

describe('selenium screen master test', function () {

    // each test should be less than 10s
    this.timeout(10e3);

    let driver;
    let WebDriver = require('selenium-webdriver');

    let ssm = new Ssm();
    const SSM_MODE = ssm.MODE;
    const MODE = SSM_MODE.TEST;
    // const MODE = SSM_MODE.COLLECT;

    ssm.setPathToReferenceFolder('./ssm-ref-folder');

    before(() => server.start());

    after(() => server.stop());

    beforeEach(() => {
        driver = new WebDriver
            .Builder()
            .usingServer(WEB_DRIVER_SERVER_URL)
            .withCapabilities({'browserName': 'chrome'})
            .build();

        ssm = new Ssm();
        ssm.setPathToReferenceFolder('./ssm-ref-folder');
        ssm.setDriver(driver);

        return ssm.setSize(1024, 768);

    });

    afterEach(() => driver.quit());

    it('Take screenshot of selector', function (done) {

        driver.get(SITE_URL);

        ssm.takeScreenshotOfSelector('#ancient-empire-strike-back').then(image => {

            resemble(image)
                .compareTo('./ssm-ref-folder/game.png')
                .onComplete(data => {

                        assert(data.misMatchPercentage === '0.00', 'Should be the same images');

                        addContext(this, {
                            title: 'Actual',
                            value: util.createTag('img', ['src', image])
                        });

                        addContext(this, {
                            title: 'Expect',
                            value: util.createTag('img', ['src', './../ssm-ref-folder/game.png'])
                        });

                        addContext(this, {
                            title: 'Different Info',
                            value: data
                        });

                        done();

                    }
                )

        })

    });

    it('Save screenshot of selector', function (done) {

        driver.get(SITE_URL);

        let pathToScreenshot = './screenshot/saved-game.png';

        driver.wait(
            new Promise((res, rej) => fs.unlink(pathToScreenshot, err => err ? rej() : res())), 1e3
        );

        ssm.saveScreenshotOfSelector('#ancient-empire-strike-back', './../' + pathToScreenshot).then(image => {

            resemble('./screenshot/saved-game.png')
                .compareTo('./ssm-ref-folder/game.png')
                .onComplete(data => {

                        assert(data.misMatchPercentage === '0.00', 'Should be the same images');

                        addContext(this, {
                            title: 'Actual',
                            value: util.createTag('img', ['src', './../' + pathToScreenshot])
                        });

                        addContext(this, {
                            title: 'Expect',
                            value: util.createTag('img', ['src', './../ssm-ref-folder/game.png'])
                        });

                        addContext(this, {
                            title: 'Different Info',
                            value: data
                        });

                        done();

                    }
                )

        })

    });

    it('Comparing screenshots', function () {

        driver.get(SITE_URL);

        return ssm
            .compareOfSelector('[id="1001-tangram"]', {
                image: './game.png',
                mode: MODE
            })
            .then(comparing => {

                assert(comparing.info.misMatchPercentage !== 0, 'Should be the different images');

                addContext(this, {
                    title: 'Actual',
                    value: util.createTag('img', ['src', comparing.actual])
                });

                addContext(this, {
                    title: 'Expect',
                    value: util.createTag('img', ['src', comparing.expect])
                });

                addContext(this, {
                    title: 'Different',
                    value: util.createTag('img', ['src', comparing.different])
                });

                addContext(this, {
                    title: 'Different Info',
                    value: comparing.info
                });

            });

    });

    it('Comparing footer of selector', function () {

        driver.get(SITE_URL);

        return ssm
            .compareOfSelector('body > div:last-child', {
                image: './footer.png',
                mode: MODE
            })
            .then(comparing => {

                assert(comparing.info.misMatchPercentage === 0, 'Should be the same images');

                addContext(this, {
                    title: 'Actual',
                    value: util.createTag('img', ['src', comparing.actual])
                });

                addContext(this, {
                    title: 'Expect',
                    value: util.createTag('img', ['src', comparing.expect])
                });

                addContext(this, {
                    title: 'Different',
                    value: util.createTag('img', ['src', comparing.different])
                });

                addContext(this, {
                    title: 'Different Info',
                    value: comparing.info
                });

            });

    });

});
