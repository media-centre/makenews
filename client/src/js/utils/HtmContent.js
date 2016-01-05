"use strict";

export default function getHtmlContent(content) {
    let element = document.createElement("div");
    element.innerHTML = content;
    return element.textContent;
}
