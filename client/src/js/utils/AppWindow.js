"use strict";

export default class AppWindow {

    static instance() {
        return new AppWindow();
    }

    get(key) {
        return this.getWindow()[key];
    }

    set(key, value) {
        this.getWindow()[key] = value;
    }

    getWindow() {
        if(!window.mediaCenter) {
            window.mediaCenter = {};
        }
        return window.mediaCenter;
    }
}
