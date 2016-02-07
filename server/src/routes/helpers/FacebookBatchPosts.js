/* eslint consistent-this:0*/
"use strict";
import moment from "moment";
import StringUtil from "../../../../common/src/util/StringUtil";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler.js";
import FacebookAccessToken from "../../facebook/FacebookAccessToken.js";
import Route from "./Route.js";
import RouteLogger from "../RouteLogger.js";

export default class FacebookBatchPosts extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.userName = this.request.body.userName;
    }

    valid() {
        if(StringUtil.isEmptyString(this.userName) || !this.isValidRequestData()) {
            return false;
        }
        return true;
    }

    handle() {
        if(!this.valid()) {
            RouteLogger.instance().warn("FacebookBatchPosts:: invalid facebook feed batch request for user %s.", this.userName);
            return this._handleInvalidRoute();
        }

        FacebookAccessToken.instance().getAccessToken(this.userName).then((accessToken) => {
            this._fetchPagePosts(accessToken);
        }).catch(error => {
            this._handleFailure(error);
        });
    }

    _fetchPagePosts(accessToken) {
        let allFeeds = {};
        let counter = 0;
        let facebookRequestHandler = FacebookRequestHandler.instance(accessToken);

        this.request.body.data.forEach((item)=> {
            let options = {};

            if (item.timestamp) {
                options.since = moment(item.timestamp).toISOString();
            }
            facebookRequestHandler.pagePosts(item.url, options).then(feeds => {
                allFeeds[item.id] = feeds;
                counter += 1;
                if (this.request.body.data.length === counter) {
                    RouteLogger.instance().debug("FacebookBatchPosts:: successfully fetched facebook feeds for url %s.", item.url);
                    this._handleSuccess({ "posts": allFeeds });
                }
            }).catch(() => {
                counter += 1;
                allFeeds[item.id] = "failed";
                if (this.request.body.data.length === counter) {
                    RouteLogger.instance().debug("FacebookBatchPosts:: fetching facebook feeds for url %s returned no feeds.", item.url);
                    this._handleSuccess({ "posts": allFeeds });
                }
            });
        });
    }
}
