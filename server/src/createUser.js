/*eslint no-console:0 */
"use strict";
import AdminDbClient from "./db/AdminDbClient.js";
import Migration from "./migration/Migration";
import ApplicationConfig from "./config/ApplicationConfig.js";

var argv = require("yargs").argv;

let migrateDb = (dbName, token) => {
    console.log("migrating db...");
    let migrationInstance = Migration.instance(dbName, token);
    migrationInstance.start().then(() => {
        console.log("migration complete.");
    }).catch(error => {
        console.log("error while migrating db.", error);
    });
};

let setPermissions = (dbInstance, userName, dbName) => {
    console.log("setting permissions...");
    dbInstance.setPermissions(userName, dbName).then(() => {
        console.log("user permissions are set to database");
        migrateDb(dbName, dbInstance.accessToken);
    }).catch(error => {
        console.log(`set permissions failed with error ${error}`);
    });
};

let createDb = (dbInstance, userName, dbName) => {
    console.log("creating user database...");
    dbInstance.createDb(dbName).then(() => {
        console.log("created user db.");
        setPermissions(dbInstance, userName, dbName);
    }).catch(error => {
        console.log(`database creation failed with error ${error}`);
    });
};

console.log("usage:: node dist/server/src/createUser.js [--admin_user_name='username' --admin_password='password' --user_name='userName' --user_password='password']");
console.log("usage:: node dist/server/src/createUser.js [--user_name='userName' --user_password='password']");
console.log("usage:: node dist/server/src/createUser.js");

let appConfig = new ApplicationConfig();

let adminUserName = argv.admin_user_name ? argv.admin_user_name : appConfig.adminDetails().couchDbAdmin.username;
let adminPassword = argv.admin_password ? argv.admin_password : appConfig.adminDetails().couchDbAdmin.password;

console.log("User creation started.");
AdminDbClient.instance(adminUserName, adminPassword, argv.user_name).then(dbInstance => {
    let userName = argv.user_name, password = argv.user_password || Math.random().toString("36").slice("-8"), dbName = argv.user_name;
    console.log("creating user...");
    dbInstance.createUser(userName, password).then(() => {
        console.log(`created user: ${userName} with password: ${password}`);
        createDb(dbInstance, userName, dbName);
    }).catch(error => {
        console.log(`user creation failed with error ${error}`);
    });

});

