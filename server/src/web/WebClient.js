import read from "read-art";
import { sanitizeHTML } from "./../../../common/src/util/SanitizeHTML";

export function fetchArticleData(url) {
    return new Promise((resolve, reject) => {
        const selector = {
            "selectors": {
                "content": "[id^='content-body'],p.section1,div.section1,.content,.body,.story-details"
            }
        };
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
