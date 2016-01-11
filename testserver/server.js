"use strict";
var routes = require("./routes.js");
var express = require("express");

const PORT = 3000;

var app = express();
routes(app);

console.log("listening on port " + PORT); //eslint-disable-line
app.listen(PORT);
