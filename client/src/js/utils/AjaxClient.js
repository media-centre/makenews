import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import UserSession from "../user/UserSession";
import AppWindow from "../utils/AppWindow";
import fetch from "isomorphic-fetch";
import { isCordova } from "./Constants";

export default class AjaxClient {
    static instance(url, skipTimer) {
        return new AjaxClient(url, skipTimer);
    }

    constructor(url, isAutomatic) {
        if (!isAutomatic) {
            UserSession.instance().setLastAccessedTime();
        }
        this.url = AppWindow.instance().get("serverUrl") + url;
    }

    async post(headers, data) {
        return await this.request({
            "method": "POST",
            "headers": headers,
            "body": JSON.stringify(data)
        });
    }

    async put(headers, data) {
        return await this.request({
            "method": "PUT",
            "headers": headers,
            "body": JSON.stringify(data)
        });
    }

    async sendRequest(requestType, queryParams = {}) {
        const keys = Object.keys(queryParams);
        if (keys.length) {
            this.url = this.url + "?";
            const keyValues = keys.map(queryKey => `${queryKey}=${encodeURIComponent(queryParams[queryKey])}`);
            this.url = this.url + keyValues.join("&");
        }
        return await this.request({
            "method": requestType
        });
    }

    async get(queryParams = {}) {
        return await this.sendRequest("GET", queryParams);
    }

    async deleteRequest(queryParams = {}) {
        return await this.sendRequest("DELETE", queryParams);
    }

    async request(params) {
        params.credentials = isCordova ? "include" : "same-origin";
        const response = await fetch(this.url, params);

        const responseJson = await response.json();

        if (response.status === this.responseCodes().OK) {
            return responseJson;
        } else if(response.status === this.responseCodes().UNAUTHORIZED) {
            if (responseJson.message === "session expired") {
                UserSession.instance().autoLogout();
            }
            throw responseJson;
        } else if (response.status === this.responseCodes().BAD_GATEWAY) {
            throw "connection refused"; //eslint-disable-line no-throw-literal
        }
        throw responseJson;
    }

    responseCodes() {
        return {
            "BAD_GATEWAY": HttpResponseHandler.codes.BAD_GATEWAY,
            "REQUEST_FINISHED": 4,
            "OK": HttpResponseHandler.codes.OK,
            "UNAUTHORIZED": HttpResponseHandler.codes.UNAUTHORIZED
        };
    }
}
