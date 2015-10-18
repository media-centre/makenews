var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

// middleware to use for all requests - validations and logging all the requests
router.use(function(req, res, next) {
    next(); // make sure we go to the next routes and don't stop here
});

app.use(express.static(__dirname + '/client'));

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

// (accessed at POST http://localhost:8080/api/login)
router.route('/login')
.post(function(req, res) {
    console.log("User name = " + req.body.username);
    console.log("Password = " + req.body.password);
    res.json({message: 'received'});
});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
