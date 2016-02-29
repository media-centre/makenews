"use strict";

import AppSessionStorage from "../../utils/AppSessionStorage.js";
import Locale from "../Locale";
export default class TakeTour {
    static show() {
        let takeTourMaskElement = document.getElementById("take-tour-mask");
        let messages = Locale.applicationStrings().messages.applicationTour;
        if(takeTourMaskElement === null) {
            takeTourMaskElement = document.createElement("div");
            takeTourMaskElement.id = "take-tour-mask";
            takeTourMaskElement.className = "take-tour-mask mask";
            takeTourMaskElement.innerHTML = `<div class='take-tour bottom-box-shadow anim' id='take-tour'>
                                            <div class='tour-popup'>
                                                <p class='description'>
                                                    <i class="fa fa-info-circle"></i>
                                                    ${messages.description}
                                                </p>
                                                <div class='t-right'>
                                                    <button id='tour-abort' class="btn-secondary border">${messages.gotItText}</button>
                                                </div>
                                            </div>
                                        </div>`;
            document.body.appendChild(takeTourMaskElement);

            document.getElementById("tour-abort").addEventListener("click", ()=> {
                TakeTour.close();
            });
        }
        document.body.style.overflow = "hidden";
        document.getElementById("tour-abort").textContent = "Got it";
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
