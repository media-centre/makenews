"use strict";
import FacebookRouteHelper from "./helpers/FacebookRouteHelper.js";

export default (app) => {
    app.get("/facebook-feeds", (request, response) => {
        new FacebookRouteHelper(request, response).pageRouter();
    });
};
