/* eslint no-plusplus:0 */

"use strict";

const RSS = "rss";
const FACEBOOK = "facebook";
const TWITTER = "twitter";

export function stringToHtml(content) {

    let tempDivNode = document.createElement("div");
    tempDivNode.innerHTML = content;
    return { "__html": tempDivNode.textContent };
}

export function getUrl(category) {
    let hrefUrl = "#";
    if (category.feedType === TWITTER) {
        hrefUrl = "https://twitter.com/" + category.sourceId + "/status/" + category._id;
    } else if (category.feedType === FACEBOOK) {
        hrefUrl = "https://www.facebook.com/" + category._id;
    } else if (category.feedType === RSS) {
        hrefUrl = category._id;
    }
    return hrefUrl;
}
