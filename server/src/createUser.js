/*eslint no-console:0 */
import AdminDbClient from "./db/AdminDbClient";
import Migration from "./migration/Migration";
import ApplicationConfig from "./config/ApplicationConfig";
import CryptUtil from "./util/CryptUtil";

const argv = require("yargs").argv;

const migrateDb = (dbName, token) => {
    console.log("migrating db...");
    const migrationInstance = Migration.instance(dbName, token);
    migrationInstance.start().then(() => {
        console.log("migration complete.");
    }).catch(error => {
        console.log("error while migrating db.", JSON.stringify(error));
    });
};

// let setPermissions = (dbInstance, userName, dbName) => {
//     console.log("setting permissions...");
//     dbInstance.setPermissions(userName, dbName).then(() => {
//         console.log("user permissions are set to database");
//         migrateDb(dbName, dbInstance.accessToken);
//     }).catch(error => {
//         console.log(`set permissions failed with error ${JSON.stringify(error)}`);
//     });
// };

const createDb = (dbInstance, userName, dbName) => {
    console.log("creating user database...");
    dbInstance.createDb(dbName).then(() => {
        console.log("created user db.");
        // setPermissions(dbInstance, userName, dbName);
        migrateDb(dbName, dbInstance.accessToken);
    }).catch(error => {
        console.log(`database creation failed with error ${JSON.stringify(error)}`);
    });
};

console.log("usage:: node dist/server/src/createUser.js [--admin_user_name='username' --admin_password='password' --user_name='userName' --user_password='password']");
console.log("usage:: node dist/server/src/createUser.js [--user_name='userName' --user_password='password']");
console.log("usage:: node dist/server/src/createUser.js");

const appConfig = new ApplicationConfig();

const adminUserName = argv.admin_user_name ? argv.admin_user_name : appConfig.adminDetails().username;
const adminPassword = argv.admin_password ? argv.admin_password : appConfig.adminDetails().password;

console.log("User creation started.");
AdminDbClient.instance(adminUserName, adminPassword, argv.user_name).then(dbInstance => {
    const userName = argv.user_name;
    const password = argv.user_password || Math.random().toString("36").slice("-8");
    const dbName = CryptUtil.dbNameHash(argv.user_name);
    console.log("creating user...");
    dbInstance.createUser(userName, password).then(() => {
        console.log(`created user: ${userName} with password: ${password}`);
        createDb(dbInstance, userName, dbName);
    }).catch(error => {
        console.log(`user creation failed with error ${JSON.stringify(error)}`);
    });

});

