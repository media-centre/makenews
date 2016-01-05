"use strict";
import FetchFeedsFromAllSources from "./FetchFeedsFromAllSources.js";

export default (app) => {
    app.post("/fetch-all-feeds-from-all-sources", (request, response) => {
        new FetchFeedsFromAllSources(request, response).fetchFeeds();
    });
};
