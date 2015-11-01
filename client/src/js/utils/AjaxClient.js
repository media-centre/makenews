import StringUtil from './StringUtil.js';

export default class AjaxClient {
  constructor(url) {
    this.url = window.location.origin + url;
  }

  post(headers, data) {
      return this.request('POST', headers, data);
  }

  request(method, headers, data={}) {
    let xhttp = new XMLHttpRequest();
    xhttp.open(method, this.url, true);
    this.setRequestHeaders(xhttp, headers);
    xhttp.send(JSON.stringify(data));
    return this.responsePromise(xhttp);
  }

  setRequestHeaders(xhttp, userHeaders) {
    for (let key in userHeaders) {
      if ( StringUtil.validNonEmptyString(key) && StringUtil.validString(userHeaders[key])) {
        xhttp.setRequestHeader(key.trim(), userHeaders[key].trim());
      }
    }
  }

  responsePromise(xhttp) {
    return new Promise((resolve, reject) => {
          xhttp.onreadystatechange = function(event) {
            if (xhttp.readyState == 4) {
              if (xhttp.status == 200) {
                let jsonResponse = JSON.parse(event.target.response);
                resolve(jsonResponse);
              } else if (xhttp.status == 401) {
                let jsonResponse = JSON.parse(event.target.response);
                reject(jsonResponse);
              } else {
                reject('error');
              }
            }
          };
        });
  }
}
