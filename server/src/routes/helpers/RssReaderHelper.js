"use strict";

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil";
import restRequest from "request";
import { parseString } from "xml2js";

export default class RssReaderHelper {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }
    feedsForUrl() {
        let url = this.request.query.url;
        if(StringUtil.isEmptyString(url)) {
            this.response.status(HttpResponseHandler.codes.OK);
            this.response.json({});
        } else {
            restRequest.get({
                "uri": url,
                "headers": { "content-type": "application/x-www-form-urlencoded" }
            },
                (error, response, body) => {
                    if(error) {
                        this.response.status(HttpResponseHandler.codes.NOT_FOUND);
                        this.response.json({ "message": error });
                    } else if(new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK)) {
                        parseString(body, (err, result) => {
                            let data = result, status = HttpResponseHandler.codes.OK;
                            if(err || !(data.rss && data.rss.channel)) {
                                data = {};
                                status = HttpResponseHandler.codes.NOT_FOUND;
                            }
                            this.response.status(status);
                            this.response.json(data);
                        });
                    } else {
                        this.response.status(HttpResponseHandler.codes.NOT_FOUND);
                        this.response.json({});
                    }
                });
        }
    }
}
