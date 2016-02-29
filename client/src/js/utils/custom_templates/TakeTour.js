"use strict";

import AppSessionStorage from "../../utils/AppSessionStorage.js";
export default class TakeTour {
    static show() {
        let takeTourMaskElement = document.getElementById("take-tour-mask");
        if(takeTourMaskElement === null) {
            takeTourMaskElement = document.createElement("div");
            takeTourMaskElement.id = "take-tour-mask";
            takeTourMaskElement.className = "take-tour-mask mask";
            takeTourMaskElement.innerHTML = `<div class='take-tour bottom-box-shadow anim' id='take-tour'>
                                            <div class='tour-top-arrow'></div>
                                            <div class='tour-popup'>
                                                <p class='description'></p>
                                                <div class='t-right'>
                                                    <!--<button id='tour-continue'>Continue</button>-->
                                                    <button id='tour-abort'>Got It</button>
                                                </div>
                                            </div>
                                        </div>`;
            document.body.appendChild(takeTourMaskElement);

            document.getElementById("tour-abort").addEventListener("click", ()=> {
                TakeTour.close();
            });

            window.addEventListener("resize", ()=> {
                TakeTour.navigateToPosition();
            });
        }
        document.body.style.overflow = "hidden";
        document.getElementById("tour-abort").textContent = "Got it";

        TakeTour.startNavigation();
    }

    static startNavigation() {
        document.getElementById("take-tour-mask").classList.remove("hide");
        TakeTour.navigateToPosition();
        TakeTour.updateContent();
    }

    static updateContent() {
        let takeTourElement = document.getElementById("take-tour");
        let descriptionDom = takeTourElement.getElementsByClassName("description")[0];

        let currentJsonElement = TakeTour.getCurrentJsonElement();
        if(descriptionDom.textContent !== currentJsonElement.content) {
            descriptionDom.textContent = currentJsonElement.content;
        }
    }

    static navigateToPosition() {
        let time = 100;
        setTimeout(()=> {
            let currentJsonElement = TakeTour.getCurrentJsonElement();
            let takeTourElement = document.getElementById("take-tour");
            let targetElement = document.querySelector(currentJsonElement.selector);
            if(takeTourElement && targetElement) {
                let tourArrow = document.getElementsByClassName("tour-top-arrow")[0];
                let maxMobileScreenSize = 600;
                if(document.body.offsetWidth <= maxMobileScreenSize) {
                    let divideFactor = 7;
                    let arrowLeft = targetElement.offsetLeft + (targetElement.offsetWidth / 2) - (takeTourElement.offsetWidth / divideFactor);
                    tourArrow.style.left = `${arrowLeft}px`;
                } else {
                    tourArrow.style.left = 0;
                }

                //let top = (targetElement.offsetTop + targetElement.offsetHeight + padding);
                //let left = (targetElement.offsetLeft + (targetElement.offsetWidth / 2) - (takeTourElement.offsetWidth / 2));
                //left = left < 0 ? padding : left;
                //takeTourElement.style.top = `${top}px`;
                //takeTourElement.style.left = `${left}px`;
                takeTourElement.style.top = "60px";
                takeTourElement.style.left = "1100px";
            }
        }, time);
    }

    static getCurrentJsonElement() {
        return {
            "selector": ".user-settings.drop-down .user-info-label",
            "actionSelector": ".user-settings.drop-down .user-info-label",
            "content": "\"HELP\" on using the application is provided in the above settings."
        };
    }

    static close() {
        document.getElementById("take-tour-mask").classList.add("hide");
        document.body.style.overflow = "auto";
        this.updateUserSeenTour();
    }

    static isTourRequired() {
        let appSessionStorage = AppSessionStorage.instance();
        return appSessionStorage.getValue(AppSessionStorage.KEYS.TAKE_TOUR) !== null;
    }

    static updateUserSeenTour() {
        let appSessionStorage = AppSessionStorage.instance();
        appSessionStorage.remove(AppSessionStorage.KEYS.TAKE_TOUR);
    }
}
