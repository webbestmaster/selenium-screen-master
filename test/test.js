/*global describe, it, beforeEach, afterEach */

"use strict";

const resemble = require('node-resemble');

const Ssm = require('./../index');
const ssm = new Ssm();

const MODES = ssm.MODES;

ssm.setPathToReferenceFolder('./ssm-ref-folder');

let assert = require('chai').assert;
let util = require('./test-util');

const addContext = require('mochawesome/addContext');

let SERVER_URL = 'http://statlex.github.io/';
let WEB_DRIVER_SERVER_URL = 'http://localhost:4444/wd/hub';

describe('selenium screen master test', function () {

    // each test should be less than 10s
    this.timeout(10e3);

    let browser;
    let webdriver = require('selenium-webdriver');
    // let byCss = webdriver.By.css;

    beforeEach(() => browser = new webdriver
        .Builder()
        .usingServer(WEB_DRIVER_SERVER_URL)
        .withCapabilities({'browserName': 'chrome'})
        .build()
    );

    afterEach(() => browser.quit());

    it('Take screenshot of selector', function (done) {

        browser.get(SERVER_URL);

        ssm.takeScreenshotOfSelector('#ancient-empire-strike-back', browser).then(image => {

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

    it('Comparing game', function () {

        browser.get(SERVER_URL);

        return ssm
            .compareOfSelector('[id="1001-tangram"]', {
                browser: browser,
                image: './game.png',
                mode: MODES.TEST
            })
            .then(comparing => {

                assert(comparing.info.misMatchPercentage !== '0.00', 'Should be the different images');

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

        browser.get(SERVER_URL);

        return ssm
            .compareOfSelector('body > div:last-child', {
                browser: browser,
                image: './footer.png',
                mode: MODES.TEST
            })
            .then(comparing => {

                assert(comparing.info.misMatchPercentage === '0.00', 'Should be the same images');

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
