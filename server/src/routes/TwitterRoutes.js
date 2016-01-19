"use strict";
import TwitterReaderHelper from "./helpers/TwitterRouteHelper.js";

export default (app) => {
    app.get("/twitter-feeds", (request, response) => {
        new TwitterReaderHelper(request, response).twitterRouter();
    });
    app.post("/twitter-batch-feeds", (request, response) => {
        new TwitterReaderHelper(request, response).twitterBatchFetch();
    });
};
