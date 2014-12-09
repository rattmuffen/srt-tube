/* jslint node: true */
'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var formidable = require('formidable');
var fs = require('fs');
var parser = require('subtitles-parser');
var admZip = require('adm-zip');
var app = express();

var port = process.env.PORT || 7845;

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

var router = express.Router();

// Returns the extension, i.e. the text succeeding the last '.', of a given
// filename in lowercase, or null if no extension is present.
function getExtension(filename) {
    var tokenized = filename.split('.');

    if (tokenized.length < 2) {
        return null;
    }

    return tokenized[tokenized.length - 1].toLowerCase();
}

// Unzips a zip file and reads and returns the data of the first file having an
// 'srt' extension as a utf8 string, or null if no srt file could be
// found.
function extractSrtFromZip(filename) {
    var zip = new admZip(filename);
    var zipEntries = zip.getEntries();

    for (var i = 0; i < zipEntries.length; i++) {
        var fileExt = getExtension(zipEntries[i].name);
        if (fileExt === 'srt') {
            return zipEntries[i].getData().toString('utf-8');
        }
    }

    return null;
}

router.post('/upload', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var data = null;
        var fileExt = getExtension(files.file.name);

        if (fileExt === 'srt') {
            data = fs.readFileSync(files.file.path, 'utf-8');
        } else if (fileExt === 'zip') {
            data = extractSrtFromZip(files.file.path);
        }

        if (data === null) {
            console.log('Error reading file');
            return;
        }

        var subs = parser.fromSrt(data, true);
        res.send(subs);
    });        
});

app.use('/sub', router);

var server = app.listen(port, function () {
    console.log('Listening on port %d', server.address().port);
});