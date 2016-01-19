"use strict";

import StringUtil from "../../../../common/src/util/StringUtil.js";

export default class BatchRequestsRouteHelper {
    constructor(request, response) {
        this.request = request;
        this.response = response;
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
}
