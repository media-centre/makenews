/* eslint react/jsx-wrap-multilines:0 */

export default class Toast {
    static show(toastMessage) {
        if(Toast.timer !== null) {
            clearTimeout(Toast.timer);
        }
        let toastDOM = document.getElementById("custom-toast");
        if(toastDOM === null) {
            toastDOM = document.createElement("div");
            toastDOM.className = "custom-toast anim bottom-box-shadow hide clear-fix";
            toastDOM.id = "custom-toast";
            toastDOM.innerHTML = "<span class='message'></span><button class='button secondary border right'>Got it</button>";
            document.body.appendChild(toastDOM);

            toastDOM.getElementsByTagName("button")[0].addEventListener("click", ()=> { //eslint-disable-line no-magic-numbers
                Toast.close();
            });
        }
        toastDOM.getElementsByClassName("message")[0].textContent = toastMessage; //eslint-disable-line no-magic-numbers

        if(toastDOM.classList.contains("hide")) {
            toastDOM.classList.remove("hide");
        }
        Toast.hide();
    }

    static hide() {
        let time = 5000;
        Toast.timer = setTimeout(Toast.close, time);
    }

    static close() {
        if(Toast.timer !== null) {
            clearTimeout(Toast.timer);
        }
        let toastDOM = document.getElementById("custom-toast");
        if(!toastDOM.classList.contains("hide")) {
            toastDOM.classList.add("hide");
        }
    }

}
Toast.timer = null;
