/*global describe, it, beforeEach, afterEach */

"use strict";

const resemble = require('node-resemble');
const fs = require('fs');

const Ssm = require('./../index');

const assert = require('chai').assert;
const util = require('./test-util');

const addContext = require('mochawesome/addContext');

const SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;

const SERVER_URL = 'http://statlex.github.io/';
const WEB_DRIVER_SERVER_URL = 'http://localhost:4444/wd/hub';

const server = new SeleniumServer('./driver/mac/selenium-server-standalone-3.0.1.jar', {
    port: 4444,
    jvmArgs: ['-Dwebdriver.chrome.driver=./driver/mac/chromedriver']
});

describe('selenium screen master test', function () {

    // each test should be less than 10s
    this.timeout(10e3);

    let driver;
    let WebDriver = require('selenium-webdriver');

    let ssm = new Ssm();
    const SSM_MODE = ssm.MODE;

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

    });

    afterEach(() => driver.quit());

    it('Take screenshot of selector', function (done) {

        driver.get(SERVER_URL);

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

        driver.get(SERVER_URL);

        driver.wait(
            new Promise((res, rej) => fs.unlink('./screenshot/saved-game.png', err => err ? rej() : res())), 1e3
        );

        ssm.saveScreenshotOfSelector('#ancient-empire-strike-back', './../screenshot/saved-game.png').then(image => {

            resemble('./screenshot/saved-game.png')
                .compareTo('./ssm-ref-folder/game.png')
                .onComplete(data => {

                        assert(data.misMatchPercentage === '0.00', 'Should be the same images');

                        addContext(this, {
                            title: 'Actual',
                            value: util.createTag('img', ['src', './../screenshot/saved-game.png'])
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

        driver.get(SERVER_URL);

        return ssm
            .compareOfSelector('[id="1001-tangram"]', {
                image: './game.png',
                mode: SSM_MODE.TEST
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

        driver.get(SERVER_URL);

        return ssm
            .compareOfSelector('body > div:last-child', {
                image: './footer.png',
                mode: SSM_MODE.TEST
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
