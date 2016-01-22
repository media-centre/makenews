/*eslint no-magic-numbers:0*/
"use strict";
var express = require("express");

const PORT = 3000;

var app = express();
//routes(app)

console.log("listening on port " + PORT); //eslint-disable-line no-console
app.listen(PORT);

app.get("/https://www.facebook.com/thehindu", (request, response, next) => {
    response.status(200);
    response.json({
        "id": "163974433696568_957858557641481"
    });
    next();
});

app.get("/https://www.facebook.com/doNotRespond/", (request, response, next) => {
    response.status(200);
    response.json({
        "id": "1235467890"
    });
    next();
});

app.get("/163974433696568_957858557641481/posts", (request, response, next) => {
    response.status(200);
    response.json({
        "data": [{ "message": "test news 1", "id": "163974433696568_957858557641481" },
            { "message": "test news 2", "id": "163974433696568_957850670975603" }]
    });
    next();
});

app.get("/123456789012345/posts", (request, response, next) => {
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
    response.status(200);
    response.json("<rss version=\"2.0\"><channel><item>" +
        "<title>sample1</title><description>news cricket</description></item><item>" +
        "<title>sample2</title><description>news politics</description></item>" +
        "</channel></rss>");
    next();
});

app.get("/thehindu/errorfeeds", (request, response, next) => {
    response.status(404);
    response.json({});
    next();
});

app.get("/search/tweets.json", (request, response, next) => {
    var urlString = "" + request.url;//eslint-disable-line no-implicit-coercion
    if (urlString.indexOf("the_hindu") > 1) {
        response.status(200);
        response.json({
            "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1" }, {
                "id": 2,
                "id_str": "124",
                "text": "Tweet 2"
            }]
        });
    } else {
        response.status(404);
        response.json({});
    }
    next();
});
