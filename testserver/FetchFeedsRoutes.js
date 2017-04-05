/*eslint no-magic-numbers:0, no-console:0*/
"use strict"; //eslint-disable-line

function fetchFeedsRoutes(app) {
    app.get("/https://www.facebook.com/118170f0e2e427469e66f5f2740009e7/posts", (request, response, next) => {
        console.log("/https://www.facebook.com/118170f0e2e427469e66f5f2740009e7/fb_page request received");
        response.status(200);
        response.json({
            "data": [{ "message": "test news 1", "id": "163974433696568_957858557641481", "from": { "name": "some" } },
                { "message": "test news 2", "id": "163974433696568_957850670975603", "from": { "name": "some" } }],
            "paging": {
                "previous": "https://graph.facebook.com/v2.8/1608617579371619/posts?limit=25&since=1485955212&format=json",
                "next": "https://graph.facebook.com/v2.8/1608617579371619/posts?limit=25&until=1475253123&format=json"
            }
        });
        next();
    });


    app.get("/https://api.twitter.com/statuses/user_timeline.json", (request, response, next) => {
        console.log("/https://api.twitter.com/statuses/user_timeline.json request received");
        response.status(200);
        response.json([{
            "id": 835103042471096320,
            "id_str": "835103042471096320",
            "created_at": "fri dec 09 07:24:44 +0000 2016",
            "text": "just posted a photo https://t.co/7x7kvw9plf",
            "user": {
                "name": "user1"
            },
            "entities": {
                "hashtags": []
            }
        }]);
        next();
    });

    app.get("/https://www.thehindu.com", (request, response, next) => {
        console.log("/https://www.thehindu.com request received");
        response.status(200);
        response.set("Content-Type", "text/xml");
        response.send("<rss version=\"2.0\"><channel><item>" +
            "<title>sample1</title><description>news cricket</description></item><item>" +
            "<title>sample2</title><description>news politics</description></item>" +
            "</channel></rss>");
        next();
    });
}

module.exports = fetchFeedsRoutes;
