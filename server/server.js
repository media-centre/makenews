var express = require('express');
var app = express();
var path = require('path');

require('./server/routes/Routes')(app);

const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/client'));

var server = app.listen(port);
console.log('listening on port ' + port);
module.exports = server;
