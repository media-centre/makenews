/*eslint no-magic-numbers:0, no-console:0*/
"use strict"; //eslint-disable-line
function twitterRoutes(app) {

    app.get("/https://api.twitter.com/oauth/request_token", (request, response, next) => {
        console.log("https://api.twitter.com/oauth/request_token request received");
        response.status(200);
        response.json({
            "oauthToken": "oauthToken",
            "oauthTokenSecret": "oauthTokenSecret"
        });
        next();
    });

    app.get("/https://api.twitter.com/oauth/access_token", (request, response, next) => {
        console.log("https://api.twitter.com/oauth/access_token request received");
        response.status(200);
        response.json({
            "oauthAccessToken": "oauthAccessToken",
            "oauthAccessTokenSecret": "oauthTokenSecret"
        });
        next();
    });

    app.get("/https://api.twitter.com/users/search.json", (request, response, next) => {
        console.log("/https://api.twitter.com/users/search.json request received");
        response.status(200);
        response.json([{
            "id": 1277389,
            "id_str": 1277389,
            "name": "testUser",
            "location": "india"
        }]);
        next();
    });

    app.get("/https://api.twitter.com/friends/list.json", (request, response, next) => {
        console.log("/https://api.twitter.com/friends/list.json request received");
        response.status(200);
        response.json({
            "users": [{
                "id": 1277389,
                "id_str": 1277389,
                "name": "testUser",
                "picture": {
                    "data": {
                        "url": "imagelink"
                    }
                }
            }],
            "next_cursor": 3
        });
        next();
    });
}
module.exports = twitterRoutes;
