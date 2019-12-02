import { JSDOM } from "jsdom";
import sinon from "sinon";
import EnvironmentFileLoader from "../../../common/src/environment/EnvironmentFileLoader";
import EnvironmentReader from "../../../common/src/environment/EnvironmentReader";

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

const testConfig = {
    "default": {
        "serverIpAddress": "127.0.0.1",
        "serverPort": 5000,
        "couchDbUrl": "http://127.0.0.1:5984",
        "searchEngineUrl": "http://127.0.0.1:5985/local",
        "userDbPrefix": "db_",
        "adminDetails": {
            "username": "admin",
            "password": "admin",
            "db": "common"
        },
        "facebook": {
            "url": "http://localhost:3000/https://www.facebook.com",
            "appSecretKey": "asdf",
            "appId": "asdf",
            "timeOut": 4000,
            "limit": 500
        },
        "twitter": {
            "url": "https://api.twitter.com/1.1",
            "authenticateUrl": "https://api.twitter.com/oauth/authenticate",
            "consumerKey": "",
            "consumerSecret": ""
        }
    }
};

sinon.stub(EnvironmentFileLoader, "instance").returns(new EnvironmentReader(testConfig, "default"));

global.XMLHttpRequest = window.XMLHttpRequest;
