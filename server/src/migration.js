/*eslint no-console:0 */
"use strict";
import Migration from "./migration/Migration.js";
var argv = require("yargs").argv;

console.log("usage:: dist/server/src/migration.js --admin_user_name='username' --admin_password='password'");
if(!argv.admin_user_name || !argv.admin_password) {
    throw new Error("admin user name and password can not be blank");
}

console.log("Migration Started. Check the logs for the progress..");
Migration.allDbs(argv.admin_user_name, argv.admin_password).then(status => {
    console.log("[Success dbs, failed dbs] = ", status);
    console.log("Migration completed.");
    if(status[1] > 0) {
        return false;
    }
    return true;
});

