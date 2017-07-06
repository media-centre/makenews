export default class Toast {
    static show(toastMessage, type, element) {
        if(Toast.timer !== null) {
            clearTimeout(Toast.timer);
        }
        let toastDOM = document.getElementById("custom-toast");
        if(toastDOM === null) {
            toastDOM = document.createElement("div");
            toastDOM.className = "custom-toast bottom-box-shadow hide clear-fix";
            toastDOM.id = "custom-toast";
            toastDOM.setAttribute("role", "alert");
            toastDOM.innerHTML = "<i></i><span class='message'></span><button class='close' title='close message' aria-label='close message' tabindex='1'>&times;</button>";
            document.body.appendChild(toastDOM);

            toastDOM.getElementsByTagName("button")[0].addEventListener("click", ()=> { //eslint-disable-line no-magic-numbers
                Toast.close();
            });
        }
        if(toastDOM.classList.contains("hide")) {
            toastDOM.className = "custom-toast bottom-box-shadow clear-fix";
        }
        let icon = "fa fa-exclamation";
        toastDOM.style = "";
        if(type === "success") {
            icon = "fa fa-check";
        } else if (type === "collection") {
            icon = "fa fa-folder";
            toastDOM.classList.add("collection");
        } else if (type === "bookmark") {
            icon = "fa fa-bookmark";
            toastDOM.classList.add("bookmark");
        } else if (type === "search-warning") {
            toastDOM.classList.add("search-warning");
        } else if(type === "save-story") {
            icon = "fa fa-check";
            toastDOM.style.top = element.offsetTop + element.offsetHeight + element.offsetParent.offsetTop + "px";
            toastDOM.style.left = element.offsetLeft + element.offsetWidth + "px";
            toastDOM.classList.add("save-story");

        } else {
            toastDOM.className = "custom-toast bottom-box-shadow clear-fix";
        }

        toastDOM.getElementsByTagName("i")[0].classList = icon; //eslint-disable-line no-magic-numbers
        toastDOM.getElementsByClassName("message")[0].textContent = toastMessage; //eslint-disable-line no-magic-numbers

        Toast.hide();
    }

    static hide() {
        const time = 3500;
        Toast.timer = setTimeout(Toast.close, time);
    }

    static close() {
        if(Toast.timer !== null) {
            clearTimeout(Toast.timer);
        }
        const toastDOM = document.getElementById("custom-toast");
        if(!toastDOM.classList.contains("hide")) {
            toastDOM.className = "custom-toast bottom-box-shadow hide clear-fix";
        }
    }
}

Toast.timer = null;
