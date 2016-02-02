/* eslint no-console:0 */
"use strict";
import express from "express";
import routers from "./server/src/routes/Routes";
import routeErrorHandler from "./server/src/routes/RouteErrorHandler.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import EnvironmentConfig from "./server/src/config/EnvironmentConfig.js";
import path from "path";
import helmet from "helmet";
import csp from "helmet-csp";
import hsts from "hsts";
let app = express();
app.use(helmet.hidePoweredBy());
app.use(csp({
	scriptSrc : ["'self'", "'unsafe-eval'", "https://connect.facebook.net", "http://connect.facebook.net"],
	styleSrc : ["'self'", "'unsafe-inline'"]
 }));
let ninetyDaysInMilliseconds = 7776000000;
app.use(helmet.hsts({ maxAge: ninetyDaysInMilliseconds }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": true }));
app.use(cookieParser());
app.use(helmet.nosniff());
app.use(helmet.xssFilter());
app.use(helmet.frameguard("deny"));
routers(app);

const DEFAULT_PORT = 5000;
const port = EnvironmentConfig.instance(EnvironmentConfig.files.APPLICATION).get("serverPort") || DEFAULT_PORT;

app.use(express.static(path.join(__dirname, "/client")));
routeErrorHandler(app);
let server = app.listen(port);
export default server;
console.log("listening on port " + port);
