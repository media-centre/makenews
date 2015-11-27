"use strict";
import RssReaderHelper from "./helpers/RssReaderHelper.js";

export default (app) => {
    app.get("/rss-feeds", (request, response) => {
        let p = new Promise((resolve, reject) => {
            setTimeout(() => {response.json("hi"); resolve(response);}, 2000);
        });
        p.then(res => {
           return res;
        });
        //new RssReaderHelper(request, response).feedsForUrl();
        //console.log("after request");
    });
};
