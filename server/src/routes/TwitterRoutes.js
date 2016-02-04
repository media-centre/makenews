"use strict";
import TwitterRouterHelper from "./helpers/TwitterRouteHelper.js";

export default (app) => {
    app.get("/twitter-feeds", (request, response) => {
        new TwitterRouterHelper(request, response).twitterRouter();
    });
    app.post("/twitter-batch-feeds", (request, response) => {
        new TwitterRouterHelper(request, response).twitterBatchFetch();
    });
    app.get("/twitter-request-token", (request, response) => {
        new TwitterRouterHelper(request, response).requestToken();
    });
    app.get("/twitter-oauth-callback", (request, response) => {
        new TwitterRouterHelper(request, response).twitterAuthenticateCallback();
    });
};
