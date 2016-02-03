/*eslint no-magic-numbers:0, no-console:0*/
"use strict";
var express = require("express");

const PORT = 3000;

var app = express();
//routes(app)

console.log("listening on port " + PORT); //eslint-disable-line no-console
app.listen(PORT);

app.get("/https://www.facebook.com/thehindu", (request, response, next) => {
    console.log("/https://www.facebook.com/thehindu request received");
    response.status(200);
    response.json({
        "id": "163974433696568_957858557641481"
    });
    next();
});

app.get("/https://www.facebook.com/idtimeout/", (request, response, next) => {
    console.log("/https://www.facebook.com/idtimeout/ request received");
    setTimeout(function() {
        response.status(200);
        response.json({
            "id": "163974433696568_957858557641482"
        });
        next();
    }, 3000);
});

app.get("/https://www.facebook.com/feedtimeout/", (request, response, next) => {
    console.log("/https://www.facebook.com/feedtimeout/ request received");
    response.status(200);
    response.json({
        "id": "163974433696568_957858557641482"
    });
    next();
});

app.get("/https://www.facebook.com/doNotRespond/", (request, response, next) => {
    console.log("/https://www.facebook.com/doNotRespond/ request received");

    response.status(200);
    response.json({
        "id": "1235467890"
    });
    next();
});

app.get("/163974433696568_957858557641481/posts", (request, response, next) => {
    console.log("/163974433696568_957858557641481/posts request received");
    response.status(200);
    response.json({
        "data": [{ "message": "test news 1", "id": "163974433696568_957858557641481" },
            { "message": "test news 2", "id": "163974433696568_957850670975603" }]
    });
    next();
});

app.get("/163974433696568_957858557641482/posts", (request, response, next) => {
    console.log("/163974433696568_957858557641482/posts request received");
    setTimeout(function() {
        response.status(200);
        response.json({
            "data": [{ "message": "test news 1", "id": "163974433696568_957858557641481" },
                { "message": "test news 2", "id": "163974433696568_957850670975603" }]
        });
        next();
    }, 3000);
});

app.get("/123456789012345/posts", (request, response, next) => {
    console.log("/123456789012345/posts request received");

    setTimeout(function() {
        response.status(200);
        response.json({
            "data": [{ "message": "test news 1", "id": "163974433696568_957858557641481" },
                { "message": "test news 2", "id": "163974433696568_957850670975603" }]
        });
    }, 3000);
    next();
});

app.get("/1235467890/posts", (request, response, next) => {
    console.log("/1235467890/posts request received");

    response.status(404);
    response.json({
        "data": [{
            "code": "ETIMEDOUT",
            "errno": "ETIMEDOUT",
            "syscall": "connect",
            "address": "65.19.157.235",
            "port": 443
        }]
    });
    next();
});

app.get("/thehindu/rss-feeds/", (request, response, next) => {
    console.log("/thehindu/rss-feeds/ request received");

    response.status(200);
    response.json("<rss version=\"2.0\"><channel><item>" +
        "<title>sample1</title><description>news cricket</description></item><item>" +
        "<title>sample2</title><description>news politics</description></item>" +
        "</channel></rss>");
    next();
});

app.get("/thehindu/errorfeeds", (request, response, next) => {
    console.log("/thehindu/errorfeeds request received");

    response.status(404);
    response.json({});
    next();
});

app.get("/gardian/timeout-feeds", (request, response, next) => {
    console.log("/gardian/timeout-feeds request received");

    setTimeout(function() {
        response.status(200);
        response.json({});
        next();
    }, 3000);
});

app.get("/search/tweets.json", (request, response, next) => {
    var urlString = "" + request.url;//eslint-disable-line no-implicit-coercion
    console.log("/search/tweets.json request received");

    console.log("urlString = ", urlString);
    if (urlString.indexOf("the_hindu") > 1) {
        console.log("/search/tweets.json received for the_hindu");
        response.status(200);
        response.json({
            "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1" }, {
                "id": 2,
                "id_str": "124",
                "text": "Tweet 2"
            }]
        });
        return next();
    } else if (urlString.indexOf("timeout") > 1) {
        console.log("/search/tweets.json received for timeout");
        setTimeout(function() {
            response.status(200);
            response.json({
                "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1" }, {
                    "id": 2,
                    "id_str": "124",
                    "text": "Tweet 2"
                }]
            });
            return next();
        }, 3000);
    } else {
        console.log("/search/tweets.json");
        response.status(404);
        response.json({});
        return next();
    }
});

