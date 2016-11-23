/* eslint react/jsx-wrap-multilines:0*/

export function highlightRouterLink() {
    let page = window.location.hash.split("/")[1]; //eslint-disable-line no-magic-numbers
    let links = document.querySelectorAll("header ul.menu-list li a");
    for (let item = 0, length = links.length; item < length; item += 1) { //eslint-disable-line no-magic-numbers
        links[item].classList.remove("selected");
        if (links[item].classList.contains(page)) {
            links[item].classList.add("selected");
        }
    }
}

export function deHighlightRouterLink() {
    let links = document.querySelectorAll("header ul.menu-list li a");
    for(let item = 0, length = links.length; item < length; item += 1) { //eslint-disable-line no-magic-numbers
        links[item].classList.remove("selected");
    }
}
