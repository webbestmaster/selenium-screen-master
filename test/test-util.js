const fs = require('fs');
const dot = require('dot');
const addContext = require('mochawesome/addContext');

const CREATE_TAG_TEMPLATE_FUNCTION = dot.template(
    '<{{= it.tagName }}' +
        '{{~it.attributeList :value:index}}' +
            '{{= index % 2 ? (value + \'"\') : (\' \' + value + \'="\') }}' +
        '{{~}}' +
    '></{{= it.tagName }}>'
);

const util = {

    createTag: createTag,

    detectOsName: function () {

        const platformName = process.platform;

        if (/darwin/.test(platformName)) {
            return 'darwin';
        }

        if (/linux/.test(platformName)) {
            return 'linux';
        }

        throw 'Can NOT detect OS!';

    },
    addComparing(comparing, context) {

        addContext(context, {
            title: 'Actual',
            value: createTag('img', ['src', comparing.actual])
        });

        addContext(context, {
            title: 'Expect',
            value: createTag('img', ['src', comparing.expect])
        });

        addContext(context, {
            title: 'Different',
            value: createTag('img', ['src', comparing.different])
        });

        addContext(context, {
            title: 'Different Info',
            value: comparing.info
        });

    }

};

function createTag(tagName, attributeList) {

    return CREATE_TAG_TEMPLATE_FUNCTION({
        tagName,
        attributeList
    });

}

module.exports = util;
