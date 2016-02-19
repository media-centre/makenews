"use strict";

const clientConfig = {
    "clientAppPath": "./client",
    "appMainFile": "app.js",
    "cssMainFile": "app.css",
    "templatesFile": "app.tags.js",
    "scssSrcPath": "./client/src/scss",
    "imgSrcPath": "./client/src/images",
    "fontsPath": "./client/src/fonts",
    "srcPath": "./client/src/js",
    "testPath": "./client/test",
    "distFolder": "./dist/client"
};

const serverConfig = {
    "serverAppPath": "./server",
    "srcPath": "./server/src",
    "testPath": "./server/test",
    "distFolder": "./dist/server",
    "distServerJsFolder": "./dist",
    "serverJsFile": "server.js",
    "packageJsonFile": "package.json"
};

const commonConfig = {
    "appPath": "./common",
    "srcPath": "./common/src",
    "testPath": "./common/test",
    "distFolder": "./dist/common"
};

const mobileConfig = {
    "appPath": "./dist/client",
    "cordovaPath": "./dist/mobile/www",
    "mobilePath": "/dist/mobile"
};

const functionalConfig = {
    "serverSpecPath": "./server/functionalTest",
    "testServerPath": "./testserver"
};

const otherConfig = {
    "ansibleScrptsPath": "./other/ansible",
    "ansibleDistFolder": "./dist/ansible",
    "distFolder": "./dist"
};

module.exports = { "client": clientConfig, "server": serverConfig, "common": commonConfig, "mobile": mobileConfig, "functional": functionalConfig, "other": otherConfig };
