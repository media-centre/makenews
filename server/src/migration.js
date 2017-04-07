/*eslint no-console:0 no-process-exit:0*/
import Migration from "./migration/Migration";
import ApplicationConfig from "./config/ApplicationConfig";
import AdminDbClient from "../src/db/AdminDbClient";
var argv = require("yargs").argv;

try {

    console.log("usage:: node dist/server/src/migration.js [--admin_user_name='username' --admin_password='password']");

    let appConfig = new ApplicationConfig();

    let adminUserName = argv.admin_user_name ? argv.admin_user_name : appConfig.adminDetails().username;
    let adminPassword = argv.admin_password ? argv.admin_password : appConfig.adminDetails().password;
    let adminDb = appConfig.adminDetails().db;

    console.log("Migration Started. Check the logs for the progress..");

    console.log("started admin migration");
    AdminDbClient.instance(adminUserName, adminPassword, adminDb).then(adminDbClient => {
        let migrationInstance = Migration.instance(adminDb, adminDbClient.accessToken, true);
        migrationInstance.start().then(() => {
            console.log("completed admin migration");
        }).catch(error => {
            console.log("error while migrating db.", error);
        });
    });

    console.log("started user db migration");

    Migration.allDbs(adminUserName, adminPassword).then(status => {
        console.log("[Success dbs, failed dbs] = ", status);
        console.log("Migration completed.");
        if(status[1] > 0) {  //eslint-disable-line no-magic-numbers
            console.log("migration failed. [Success dbs, failed dbs] = " + status);
            process.exit(1); //eslint-disable-line no-magic-numbers
        }
        console.log("completed user db migration");
        return true;
    }).catch(error => {
        console.log(`Authentication failed. error = ${JSON.stringify(error)}`);
        process.exit(1); //eslint-disable-line no-magic-numbers

    });
} catch(error) {
    console.log(`Unexpected Error = ${JSON.stringify(error)}`);
    process.exit(1); //eslint-disable-line no-magic-numbers

}

