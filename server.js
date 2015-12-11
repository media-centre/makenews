/* eslint no-console:0 */
"use strict";
import express from "express";
import routers from "./server/src/routes/Routes";
import routeErrorHandler from "./server/src/routes/RouteErrorHandler.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import EnvironmentConfig from "./server/src/config/EnvironmentConfig.js";
import FacebookClient from "./server/src/facebook/FacebookClient.js";
import path from "path";
import helmet from "helmet";
import crypto from "crypto";
let app = express();
app.use(helmet.hidePoweredBy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet.nosniff());
app.use(helmet.xssFilter());
app.use(helmet.frameguard("deny"));
routers(app);

const DEFAULT_PORT = 5000;
const port = EnvironmentConfig.instance(EnvironmentConfig.files.APPLICATION).get("serverPort") || DEFAULT_PORT;

app.use(express.static(path.join(__dirname, "/client")));
let appsecretProof = crypto.createHmac("SHA256", "abf3d1db7a48cb08f936d6caae17b964");
appsecretProof.setEncoding("hex");
let token = "CAAGG4KNMtVEBAGJ0DlZCH1b1t1lZCZCMGRxkPZAnL3YasbArkZBg3iT3VLHe9OZCV1J1qITJA9LojaCTDqaK3dpZCjs9JebnLAZBFrxKZBEUhkLZBCNZCbpA7T7Rt6A0slX6EniG1jr7ZAKVPU9inZCYLkyaiEE4LAQ9gxIz6eOZA7FgLibbR1m2zTBHhbNSkaCuNNXKQIz26h1LFfV6ZCzth9P7woj";
appsecretProof.write(token);
appsecretProof.end();
let hash = appsecretProof.read();
console.log(hash);
let facebookClient = new FacebookClient(token, hash);
facebookClient.pageFeeds("thehindu").then((feeds) => {
    console.log(feeds);
}).catch(error => {
    console.log(error);
});
routeErrorHandler(app);
let server = app.listen(port);
export default server;
console.log("listening on port " + port);
