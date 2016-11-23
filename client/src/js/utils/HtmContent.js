/* eslint react/jsx-wrap-multilines:0*/

export default function getHtmlContent(content) {
    let element = document.createElement("div");
    element.innerHTML = content;
    return element.textContent;
}
