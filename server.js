var url = require('url-parse');
var express = require('express');
var app = express();
var url = require('url-parse');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var sanitizer = require("sanitizer");


var obj = JSON.parse(fs.readFileSync('studentdir.json', 'utf8'));
var log = JSON.parse(fs.readFileSync('log.json', 'utf8'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



app.use(express.static('public'));

var server = app.listen(8081, function() {
  var port = server.address().port;
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('Example app listening at http://%s:%s', add, port);
  })
  fs.appendFileSync("logfile.log", "Started server on port " + port + " at " + getTime() + " on " + getDate() + "\n\n\n");
});
