import fetch from "isomorphic-fetch";
import HttpResponseHandler from "./../../../common/src/HttpResponseHandler";
import { constructQueryString } from "./../../../common/src/util/HttpRequestUtil";

export async function getRequest(url, params = {}) {
    const response = await fetch(`${url}?${constructQueryString(params)}`);
    const responseJson = await response.json();

    if(response.status === HttpResponseHandler.codes.OK) {
        return responseJson;
    }
    
    const errorMessage = { "status": response.status, "error": responseJson };
    throw errorMessage;
}
