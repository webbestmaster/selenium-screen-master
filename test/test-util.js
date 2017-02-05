const fs = require('fs');
const dot = require('dot');

const CREATE_TAG_TEMPLATE_FUNCTION = dot.template(
    '<{{= it.tagName }}' +
        '{{~it.attributeList :value:index}}' +
            '{{= index % 2 ? (value + \'"\') : (\' \' + value + \'="\') }}' +
        '{{~}}' +
    '></{{= it.tagName }}>'
);

const util = {

    createTag: function (tagName, attributeList) {

        return CREATE_TAG_TEMPLATE_FUNCTION({
            tagName,
            attributeList
        });

    }

};

module.exports = util;
