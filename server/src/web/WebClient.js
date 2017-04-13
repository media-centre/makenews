import read from "read-art";
import { sanitizeHTML } from "./../../../common/src/util/SanitizeHTML";
import { articleConfig } from "./../Factory";

export function fetchArticleData(url) {
    return new Promise((resolve, reject) => {
        let selector = {};

        const domainExtract = /:\/\/(.[^/]+)/;
        const [, domain] = url.match(domainExtract);

        const querySelector = articleConfig.getSelectors()[domain];
        if(querySelector) {
            selector.selectors = { "content": querySelector };
        }

        read(url, selector).then(article => {
            if(!article.content) {
                reject("not able to get the data");
            }
            resolve(sanitizeHTML(article.content));
        }).catch(err => {
            reject(`Not able to get the data. Error details: ${err.message}`);
        });
    });
}
