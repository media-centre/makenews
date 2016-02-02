"use strict";
import FacebookPostsRoute from "./helpers/FacebookPostsRoute.js";
import FacebookBatchPosts from "./helpers/FacebookBatchPosts.js";
import FacebookSetAccessTokenRoute from "./helpers/FacebookSetAccessTokenRoute.js";

export default (app) => {
    app.get("/facebook-posts", (request, response, next) => {
        new FacebookPostsRoute(request, response, next).handle();
    });

    app.post("/facebook-set-token", (request, response, next) => {
        new FacebookSetAccessTokenRoute(request, response, next).handle();
    });

    app.post("/facebook-batch-posts", (request, response, next) => {
        new FacebookBatchPosts(request, response, next).handle();
    });
};
