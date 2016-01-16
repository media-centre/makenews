/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import NodeErrorHandler from "../../NodeErrorHandler";
import StringUtil from "../../../../common/src/util/StringUtil";
import EnvironmentConfig from "../../config/EnvironmentConfig";
import TwitterRequestHandler from "../../twitter/TwitterRequestHandler";
import ResponseUtil from "../../util/ResponseUtil";
import restRequest from "request";


export default class TwitterRouteHelper {

    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    twitterRouter() {
        let url = this.request.query.url;
        if(StringUtil.isEmptyString(url)) {
            ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, {});
        } else {
            let twitterRequestHandler = TwitterRequestHandler.instance();
            twitterRequestHandler.fetchTweetsRequest(url).then(feeds => {
                ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, feeds);
            }).catch(error => {
                ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.NOT_FOUND, error);
            });
        }
    }

    twitterBatchFetch() {
        let allFeeds = {};
        let counter = 0;
        let twitterRequestHandler = TwitterRequestHandler.instance();

        this.request.body.data.forEach((item)=> {
            twitterRequestHandler.fetchTweetsRequest(item.url).then(feeds => {
                allFeeds[item.id] = feeds;
                if(this.request.body.data.length - 1 === counter) {
                    ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, allFeeds);
                }
                counter += 1;
            }).catch(() => {
                allFeeds[item.id] = "failed";
                if (this.request.body.data.length - 1 === counter) {
                    ResponseUtil.setResponse(this.response, HttpResponseHandler.codes.OK, allFeeds);

                }
                counter += 1;
            });
        });
    }

    setResponse(status, responseJson) {
        this.response.status(status);
        this.response.json(responseJson);
    }
}
