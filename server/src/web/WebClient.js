import read from "node-readability";
import { sanitizeHTML } from "./../../../common/src/util/SanitizeHTML";
import NodeErrorHandler from "./../../src/NodeErrorHandler";

export function fetchArticleData(url) {
    return new Promise((resolve, reject) => {
        read(url, function(err, article) {
            if (NodeErrorHandler.noError(err)) {
                if(!article.content) {
                    reject("not able to get the data");
                }
                resolve(sanitizeHTML(article.content));
            }
            reject(err);
        });
    });
}
