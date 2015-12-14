/* eslint no-plusplus:0 */

"use strict";

export function stringToHtml(content) {

    let tempDivNode = document.createElement("div");
    tempDivNode.innerHTML = content;
    return { "__html": tempDivNode.textContent };
}
