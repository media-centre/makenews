"use strict";
import TwitterReaderHelper from "./helpers/TwitterRouteHelper.js";

export default (app) => {
    app.get("/twitter-feeds", (request, response) => {
        new TwitterReaderHelper(request, response).twitterRouter();
    });
};
