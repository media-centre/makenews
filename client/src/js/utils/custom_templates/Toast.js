export default class Toast {
    static show(toastMessage, type) {
        if(Toast.timer !== null) {
            clearTimeout(Toast.timer);
        }
        let toastDOM = document.getElementById("custom-toast");
        if(toastDOM === null) {
            toastDOM = document.createElement("div");
            toastDOM.className = "custom-toast bottom-box-shadow hide clear-fix";
            toastDOM.id = "custom-toast";
            toastDOM.innerHTML = "<i></i><span class='message'></span><button>&times;</button>";
            document.body.appendChild(toastDOM);

            toastDOM.getElementsByTagName("button")[0].addEventListener("click", ()=> { //eslint-disable-line no-magic-numbers
                Toast.close();
            });
        }
        if(toastDOM.classList.contains("hide")) {
            toastDOM.classList.remove("hide");
            toastDOM.classList.remove("collection");
            toastDOM.classList.remove("bookmark");
        }
        let icon = "fa fa-exclamation";
        if(type === "success") {
            icon = "fa fa-check";
        } else if (type === "collection") {
            icon = "fa fa-folder";
            toastDOM.classList.add("collection");
        } else if (type === "bookmark") {
            icon = "fa fa-bookmark";
            toastDOM.classList.add("bookmark");
        } else {
            toastDOM.classList.remove("collection");
            toastDOM.classList.remove("bookmark");
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
            toastDOM.classList.add("hide");
            toastDOM.classList.remove("collection");
            toastDOM.classList.remove("bookmark");
        }
    }
}

Toast.timer = null;
