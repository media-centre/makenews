export default function externalNavigation(url) {
    url = encodeURI(url);
    var a = document.createElement("a");
    a.setAttribute("href", url);
    a.click();
}