"use strict";
import TwitterReaderHelper from "./helpers/TwitterReaderHelper.js";

export default (app) => {
    app.get("/twitter-feeds", (request, response) => {
        new TwitterReaderHelper(request, response).feedsForUrl();
    });
};
