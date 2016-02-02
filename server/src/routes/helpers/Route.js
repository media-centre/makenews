"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil.js";

export default class Route {
    constructor(request, response, next) {
        if(!request || !response) {
            throw new Error("request or response can not be empty");
        }

        this.request = request;
        this.response = response;
        this.next = next;
    }

    handle() {
    }

    isValidRequestData() {
        if(!this.request.body || !this.request.body.data || this.request.body.data.length === 0) {
            return false;
        }
        let errorItems = this.request.body.data.filter((item)=> {
            if(StringUtil.isEmptyString(item.timestamp) || StringUtil.isEmptyString(item.url) || StringUtil.isEmptyString(item.id)) {
                return item;
            }
        });

        return errorItems.length === 0;
    }

    _handleFailure(error) {
        this.response.status(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR);
        this.response.json(error);
    }

    _handleInvalidRoute() {
        this.response.status(HttpResponseHandler.codes.BAD_REQUEST);
        this.response.json({ "message": "bad request" });
    }

    _handleSuccess(json) {
        this.response.status(HttpResponseHandler.codes.OK);
        this.response.json(json);
    }
}