/* eslint no-plusplus:0 */

"use strict";

export function stringToHtml(content) {

    let tempDivNode = document.createElement("div");
    tempDivNode.innerHTML = content;
    let imgTags = tempDivNode.getElementsByTagName("img");

    let finalDivNode = document.createElement("div");
    for(let index = 0; index < imgTags.length; index++) {
        finalDivNode.appendChild(imgTags[index]);
    }
    let paragraphNode = document.createElement("p");
    paragraphNode.innerHTML = tempDivNode.innerText;
    finalDivNode.appendChild(paragraphNode);
    return { "__html": tempDivNode.textContent };
}
