import read from "node-readability";
import { sanitizeHTML } from "./../../../common/src/util/SanitizeHTML";

export function fetchArticleData(url) {
    return new Promise((resolve, reject) => {
        read(url, function(err, article) {
            if(err) {
                reject(err);
            }

            if(!article.content) {
                reject("not able to get the data");
            }

            resolve(sanitizeHTML(article.content));
        });
    });
}
