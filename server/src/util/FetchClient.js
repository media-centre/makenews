import fetch from "isomorphic-fetch";
import HttpResponseHandler from "./../../../common/src/HttpResponseHandler";
import HttpRequestUtil from "./../../../common/src/util/HttpRequestUtil";

export async function getRequest(url, params = {}) {
    let response = await fetch(`${url}?${new HttpRequestUtil().queryString(params)}`);
    let responseJson = await response.json();

    if(response.status === HttpResponseHandler.codes.OK) {
        return responseJson;
    }
    
    let errorMessage = { "status": response.status, "error": responseJson };
    throw errorMessage;
}
