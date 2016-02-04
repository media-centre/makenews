/* eslint consistent-this:0*/
"use strict";
import TwitterRequestHandler from "../../twitter/TwitterRequestHandler";
import Route from "./Route.js";

export default class TwitterBatchFeedsRoute extends Route {

    constructor(request, response, next) {
        super(request, response, next);
    }
    valid() {
        if(!this.isValidRequestData()) {
            return false;
        }
        return true;
    }
    handle() {
        if(!this.valid()) {
            return this._handleInvalidRoute();
        }

        let allFeeds = {};
        let counter = 0;
        let twitterRequestHandler = TwitterRequestHandler.instance();

        this.request.body.data.forEach((item)=> {
            twitterRequestHandler.fetchTweetsRequest(item.url, item.timestamp).then(feeds => {
                allFeeds[item.id] = feeds;
                if (this.request.body.data.length - 1 === counter) {
                    this._handleSuccess(allFeeds);
                }
                counter += 1;
            }).catch(() => {
                allFeeds[item.id] = "failed";
                if (this.request.body.data.length - 1 === counter) {
                    this._handleSuccess(allFeeds);
                }
                counter += 1;
            });
        });
    }
}
