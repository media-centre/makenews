/*eslint no-magic-numbers:0, no-console:0*/
"use strict"; //eslint-disable-line

function fetchFeedsRoutes(app) {
    app.get("/https://www.facebook.com/118170f0e2e427469e66f5f2740009e7/posts", (request, response, next) => {
        console.log("/https://www.facebook.com/sourceId/fb_page request received");
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
}

module.exports = fetchFeedsRoutes;
