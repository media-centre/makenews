export default class Toast {
    static show(toastMessage, type) {
        if(Toast.timer !== null) {
            clearTimeout(Toast.timer);
        }
        let toastDOM = document.getElementById("custom-toast");
        if(toastDOM === null) {
            toastDOM = document.createElement("div");
            toastDOM.className = "custom-toast anim bottom-box-shadow hide clear-fix";
            toastDOM.id = "custom-toast";
            toastDOM.innerHTML = "<img /><span class='message'></span><button>&times;</button>";
            document.body.appendChild(toastDOM);

            toastDOM.getElementsByTagName("button")[0].addEventListener("click", ()=> { //eslint-disable-line no-magic-numbers
                Toast.close();
            });
        }
        let icon = "./images/warning-icon.png";
        if(type === "success") {
            icon = "./images/success-icon.png";
        }
        toastDOM.getElementsByTagName("img")[0].src = icon; //eslint-disable-line no-magic-numbers
        toastDOM.getElementsByClassName("message")[0].textContent = toastMessage; //eslint-disable-line no-magic-numbers

        if(toastDOM.classList.contains("hide")) {
            toastDOM.classList.remove("hide");
        }
        Toast.hide();
    }

    static hide() {
        const time = 5000;
        Toast.timer = setTimeout(Toast.close, time);
    }

    static close() {
        if(Toast.timer !== null) {
            clearTimeout(Toast.timer);
        }
        const toastDOM = document.getElementById("custom-toast");
        if(!toastDOM.classList.contains("hide")) {
            toastDOM.classList.add("hide");
        }
    }
}

Toast.timer = null;
