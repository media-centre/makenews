/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import NodeErrorHandler from "../../NodeErrorHandler";
import StringUtil from "../../../../common/src/util/StringUtil";
import EnvironmentConfig from "../../config/EnvironmentConfig";
import TwitterRequestHandler from "../../twitter/TwitterRequestHandler";
import restRequest from "request";


export default class TwitterRouteHelper {

    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    twitterRouter() {
        let url = this.request.query.url;
        if(StringUtil.isEmptyString(url)) {
            this.setResponse(HttpResponseHandler.codes.OK, {});
        } else {
            let twitterRequestHandler = TwitterRequestHandler.instance();
            twitterRequestHandler.fetchTweetsRequest(url).then(feeds => {
                this.setResponse(HttpResponseHandler.codes.OK, feeds);
            }).catch(error => {
                this.setResponse(HttpResponseHandler.codes.NOT_FOUND, error);
            });
        }
    }

    setResponse(status, responseJson) {
        this.response.status(status);
        this.response.json(responseJson);
    }
}
