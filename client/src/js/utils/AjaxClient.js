"use strict";
import StringUtil from "../../../../common/src/util/StringUtil.js";
import Config from "../../../src/js/utils/Config.js";

export default class AjaxClient {
  constructor(url) {
      this.url = Config.serverUrl + url;
  }

  post(headers, data) {
      return this.request("POST", headers, data);
  }

  request(method, headers, data = {}) {
      let xhttp = new XMLHttpRequest();
      xhttp.open(method, this.url, true);
      this.setRequestHeaders(xhttp, headers);
      xhttp.send(JSON.stringify(data));
      return this.responsePromise(xhttp);
  }

  setRequestHeaders(xhttp, userHeaders) {
      for(let key in userHeaders) {
          if(StringUtil.validNonEmptyString(key) && StringUtil.validString(userHeaders[key])) {
              xhttp.setRequestHeader(key.trim(), userHeaders[key].trim());
          }
      }
  }

  responsePromise(xhttp) {
      return new Promise((resolve, reject) => {
          let response = this.responseCodes();
          xhttp.onreadystatechange = function(event) {
              if(xhttp.readyState === response.REQUEST_FINISHED) {
                  if(xhttp.status === response.OK) {
                      let jsonResponse = JSON.parse(event.target.response);
                      resolve(jsonResponse);
                  } else if(xhttp.status === response.UNAUTHORIZED) {
                      let jsonResponse = JSON.parse(event.target.response);
                      reject(jsonResponse);
                  }
                  reject("error");
              }
          };
      });
  }
  responseCodes() {
      return {
          "REQUEST_FINISHED": 4,
          "OK": 200,
          "UNAUTHORIZED": 401
      };
  }
}
