import { JSDOM } from "jsdom";

const { window } = new JSDOM("<!doctype html><html><body></body></html>");
global.window = window;
global.document = global.window.document;
global.navigator = global.window.navigator;

global.sessionStorage = {
    "item": {},
    "getItem": function(key) {
        return this.item[key] || null;
    },
    "setItem": function(key, value) {
        this.item[key] = value;
    },
    "removeItem": function(key) {
        delete this.item[key];
    }
};
global.XMLHttpRequest = window.XMLHttpRequest;
