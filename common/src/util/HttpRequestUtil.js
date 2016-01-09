"use strict";

export default class HttpRequestUtil {
    queryString(options, encode = true) {
        let keys = Object.keys(options);
        if(keys.length !== 0) {
            this.url = this.url + "?";
            let keyValues = keys.map(key => {
                return key + "=" + (encode ? encodeURIComponent(options[key]) : options[key]);
            });
            return keyValues.join("&");
        }
        return "";
    }
}
