/* jslint node: true */
'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var formidable = require('formidable');
var fs = require('fs');
var parser = require('subtitles-parser');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

var router = express.Router();

router.post('/upload', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var f = files.file.path;
        var data = fs.readFileSync(f, 'utf-8');
        var subs = parser.fromSrt(data, true);
        res.send(subs);
    });        
});

app.use('/sub', router);

var server = app.listen(7845, function () {
    console.log('Listening on port %d', server.address().port);
});