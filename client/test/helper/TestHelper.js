"use strict";
import jsdom from 'jsdom';
import React from 'react/addons';

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
global.localStorage = {
    item: {},
    getItem: function(key) {
        return this.item[key];
    },
    setItem: function(key, value) {
        this.item[key] = value;
    }
};
global.XMLHttpRequest = window.XMLHttpRequest;