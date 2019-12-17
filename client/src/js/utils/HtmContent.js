export default function getHtmlContent(content) {
    const element = document.createElement("div");
    element.innerHTML = content;
    return element.textContent;
}
