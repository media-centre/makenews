"use strict";

export default class Exception {
    constructor(name, message) {
        this.name = name;
        this.message = message;
    }
    message() {
        return this.name + " " + this.message;
    }
}

