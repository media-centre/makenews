/*eslint no-magic-numbers:0, no-console:0, max-len:0 */
/*eslint consistent-return:0 */
var express = require("express");
var facebookRoutes = require("./Facebook/FacebookRoutes");
var twitterRoutes = require("./Twitter/TwitterRoutes");
var fetchFeedsRoutes = require("./FetchFeedsRoutes");

const PORT = 3000;

var app = express();
//routes(app)

console.log("listening on port " + PORT); //eslint-disable-line no-console
app.listen(PORT);
facebookRoutes(app);
twitterRoutes(app);
fetchFeedsRoutes(app);


app.get("/thehindu/rss-feeds/", (request, response, next) => {
    console.log("/thehindu/rss-feeds/ request received");
    response.status(200);
    response.setHeader("content-type", "application/rss+xml;charset=UTF-8");
    response.json("<rss version=\"2.0\"><channel><item>" +
        "<title>sample1</title><description>news cricket</description></item><item>" +
        "<title>sample2</title><description>news politics</description></item>" +
        "</channel></rss>");
    next();
});

app.get("/news/cities/bangalore/", (request, response, next) => {
    console.log("/news/cities/bangalore/ request received");
    response.status(200);
    response.setHeader("content-type", "application/rss+xml;charset=UTF-8");
    response.json("<rss version=\"2.0\"><channel><item>" +
        "<title>CNG stations ready, where are the buses?</title><description>Will any bus use the Compressed Natural Gas (CNG) that is expected to be supplied from March</description></item><item>" +
        "<title>Leaders fret over traffic congestion</title><description>It is not only common people who are cribbing about traffic congestion</description></item>" +
        "</channel></rss>");
    next();
});

app.get("/news/cities/chennai/", (request, response, next) => {
    console.log("/news/cities/chennai/ request received");
    response.status(200);
    response.setHeader("content-type", "application/rss+xml;charset=UTF-8");
    response.json("<rss version=\"2.0\"><channel><item>" +
        "<title>Sewage woes plague road-users in Chennai</title><description>Incidents of sewage overflowing on arterial roads due to obstructions in the underground sewer network have been reported from different localities across the city</description></item><item>" +
        "<title>Not many takers for first class in Metro</title><description>As the majority of Metro users believe the fares for the first class have been priced too high, this coach has less takers, commuters say</description></item>" +
        "</channel></rss>");
    next();
});

app.get("/thehindu/error-feeds", (request, response, next) => {
    console.log("/thehindu/error-feeds request received");

    response.status(400);
    response.json({});
    next();
});

app.get("/gardian/timeout-feeds", (request, response, next) => {
    console.log("/gardian/timeout-feeds request received");

    setTimeout(function() {
        response.status(200);
        response.json({});
        next();
    }, 7000);
});

app.get("/statuses/user_timeline.json", (request, response, next) => {
    var urlString = "" + request.url;//eslint-disable-line no-implicit-coercion
    console.log("/search/tweets.json request received for handler " + urlString);

    console.log("urlString = ", urlString);
    if (urlString.indexOf("the_hindu") > 1) {
        console.log("/search/tweets.json received for the_hindu");
        response.status(200);
        response.json([{ "id": 1, "id_str": "123", "text": "Tweet 1" }, {
            "id": 2,
            "id_str": "124",
            "text": "Tweet 2"
        }]
        );
        return next();
    } else if (urlString.indexOf("timeout") > 1) {
        console.log("/search/tweets.json received for timeout");
        setTimeout(function() {
            response.status(200);
            response.json([{ "id": 1, "id_str": "123", "text": "Tweet 1" }, {
                "id": 2,
                "id_str": "124",
                "text": "Tweet 2"
            }]
            );
            return next();
        }, 3000);
    } else if (urlString.indexOf("icc") > 1) {
        response.status(200);
        response.json([{ "id": "695148613308149800", "id_str": "695148613308149760", "text": "RT @ICC: WATCH: This is one way to keep the batsman guessing - The amazing ambidextrous Mendis!" },
                         { "id": "695148540646027300", "id_str": "695148540646027264", "text": "RT @livingrichpe: @ICC are you keeping quiet while Buhari keep" }]
        );
    } else if (urlString.indexOf("martinfowler") > 1) {
        response.status(200);
        response.json([{ "id": "695147136451612700", "id_str": "695147136451612672", "text": "If you are considering adopting continuous delivery, pause any tool evalutation and assess your readiness" },
                         { "id": "695146308445741000", "id_str": "695146308445741056", "text": "In web security basics pt2 @cairnsc & @D_Somerfield foil a Supreme Court justice as an attack vector" }]
        );
    } else {
        console.log("/search/tweets.json");
        response.status(404);
        response.json({});
        return next();
    }
});

