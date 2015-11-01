import jsdom from 'jsdom';
import React from 'react/addons';

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
