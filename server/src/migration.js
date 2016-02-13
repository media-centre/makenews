/*eslint no-console:0 no-process-exit:0*/
"use strict";
import Migration from "./migration/Migration.js";
import ApplicationConfig from "./config/ApplicationConfig.js";
var argv = require("yargs").argv;

try {

    console.log("usage:: node dist/server/src/migration.js [--admin_user_name='username' --admin_password='password']");

    let appConfig = new ApplicationConfig();

    let adminUserName = argv.admin_user_name ? argv.admin_user_name : appConfig.adminDetails().couchDbAdmin.username;
    let adminPassword = argv.admin_password ? argv.admin_password : appConfig.adminDetails().couchDbAdmin.password;

    console.log("Migration Started. Check the logs for the progress..");
    Migration.allDbs(adminUserName, adminPassword).then(status => {
        console.log("[Success dbs, failed dbs] = ", status);
        console.log("Migration completed.");
        if(status[1] > 0) {
            console.log("migration failed. [Success dbs, failed dbs] = " + status);
            process.exit(1);
        }
        return true;
    }).catch(error => {
        console.log(`Authentication failed. error = ${JSON.stringify(error)}`);
        process.exit(1);

    });
} catch(error) {
    console.log(`Unexpected Error = ${JSON.stringify(error)}`);
    process.exit(1);

}

