"use strict";

export default class ResponseUtil {
    static setResponse(response, status, responseJson) {
        response.status(status);
        response.json(responseJson);
    }
}
