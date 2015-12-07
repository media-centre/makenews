export function highlightRouterLink() {
    let page = window.location.hash.split("/")[1];
    let links = document.querySelectorAll("header ul.menu-list li a");
    for(let item = 0, length = links.length; item < length; item++) {
        links[item].classList.remove("selected");
        if(links[item].classList.contains(page)) {
            links[item].classList.add("selected");
        }
    }
}

export function deHighlightRouterLink() {
    let links = document.querySelectorAll("header ul.menu-list li a");
    for(let item = 0, length = links.length; item < length; item++) {
        links[item].classList.remove("selected");
    }
}