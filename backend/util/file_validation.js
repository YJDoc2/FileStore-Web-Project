const path = require('path');

// Allowed image types
const imgExt = /jpeg|png|jpg/;
// Allowed doc/text types
const docExt = /pdf|doc|docx|epub|txt|csv|odt|ods|odp/;
const docMime = /pdf|epub+zip|plain|csv|vnd.oasis.opendocument.text|vnd.oasis.opendocument.spreadsheet|vnd.oasis.opendocument.presentation|/;
// Allowed microsoft types
const msExt = /doc|docx|ppt|pptx|xls|xlsx/;
const msMime = /msword|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.ms-powerpoint|vnd.openxmlformats-officedocument.presentationml.presentation|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet/;

// Allowed code files
const codeExt = /html|htm|css|js|json|c|cpp|java|py|sh/;
const codeMime = /html|css|javascript|json|x-c|x-java-source|x-script.phyton|x-sh|x-bsh/;

// Alloed Music/Video files
const avExt = /mp3|mpeg|wav|oga|ogv/;
const avMime = /mpeg|wav|ogg/;

// Final Regex
const allowedExt = new RegExp(
    imgExt.source +
        '|' +
        docExt.source +
        '|' +
        msExt.source +
        '|' +
        codeExt.source +
        '|' +
        avExt.source
);
const allowedMime = new RegExp(
    imgExt.source +
        '|' +
        docMime.source +
        '|' +
        msMime.source +
        '|' +
        codeMime.source +
        '|' +
        avMime.source
);

function validFile(file, cb) {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const fileMime = file.mimetype;

    const extCheck = allowedExt.test(fileExt);
    const mimeCheck = allowedMime.test(fileMime);

    if (extCheck && mimeCheck) {
        return cb(null, true);
    } else {
        return cb('Error : Invalid file Type');
    }
}

module.exports = validFile;
