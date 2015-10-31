export default class CustomAjax {
    static request(options) {
        let url = window.location.origin + options.url;
        let xhttp = new XMLHttpRequest();
        xhttp.open(options.method, url, true);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-type", "application/json");

        let requestPromise = new Promise((resolve, reject) => {
            xhttp.onreadystatechange = function(event) {
                if(xhttp.readyState == 4) {
                    if (xhttp.status == 200) {
                        let jsonResponse = JSON.parse(event.target.response);
                        resolve(jsonResponse);
                    }
                    else if(xhttp.status == 401) {
                        let jsonResponse = JSON.parse(event.target.response);
                        reject(jsonResponse);
                    }
                    else {
                        reject("error");
                    }
                }
            };
        });

        xhttp.send(JSON.stringify(options.data));
        return requestPromise;
    }
}
