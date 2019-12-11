# Makenews

## Pre Requisites:
1. Install node(version >= 4.0) npm
2. Install couchdb 2.0
3. Create an admin user in couchdb with whom you can create, delete and change databases manually on the localhost:5984/_utils/# <br />
If your admin user in couchdb is not with the name 'admin' and password 'admin', change this data in the file \" instal.config \" from this very project.
4. Install couchdb lucene 2.0
5. Install gulp


## Test Requisites:
1. write 'npm --version' in the console and it shall return the number of the certain installed npm version
2. write 'localhost:5984' on your browser and there you should see the couchdb version and some additional information about couchdb.
3. check whether you have configurate correctly the couchdb-lucene. For instance,
you can try querying a database(if you created database in couchdb and you have installed curl) like this:
```
	curl http://"your_database_ip":5984/database_name/_fti/design_doc/view_name?q=Query
```
4. write 'gulp --version' in the console and it shall return the number of the certain installed gulp version(local and cli)
5. write 'git --version' in the console and it shall return the number of the certain installed git version

## 1. Installation:

1.Clone the makenews application repository from git <br />
2. All the configuration related data must be mentioned in the install.config file <br />
* Facebook appId and app secret key must be given in the file for being able to configure data from FB sources <br />
* Twitter consumer key and consumer secret must be mentioned under twitter configuration for being able to access twitter data from makenews <br />
* Refer install.config file for instructions <br />

Comments: Facebook and Twitter appIds are not necessary to start the application, they are necessary for the actual connection between the app and facebook or twitter.<br />
3. Start couchdb <br />
4. Once the configurations are set in the install.config file, run the oneClickInstaller.sh file <br />
5. Running this file installs the makenews application with the configurations set in the install.config <br />
6. Towards the end of the execution, application user creation dialogue would be prompted on the console, enter the username and password for the intended user <br />

## 2. Start the server:

Once the installation is successful, use the following command from the root folder, to start the server 
```
node dist/server
```

The application would start running on the configured ip address and port, for the default configuration, http://127.0.0.1:5000

* Additional Information: after running the server check both consoles(the console of the browser and the cmd prompt) for some errors.
- In some cases, it is necessary to go to 127.0.0.1:5000 instead of localhost:5000, because of CORS, if you want to log in - it can give some errors in the console of the browser
- In some other cases, after trying to login the process in the cmd prompt crashes because of the permissions. That's why you should sometimes start the server with sudo(just 'sudo node dist/server')

## 3. Creating Application users:
	run createuser.sh file from dist folder

## 4. Application configurations:
	After changing any configuration,  please run gulp build and restart the server
	
### 4.a Server configuration:

The server configuration file path is server/config/application.json

``` javascript
{

 "default": { //default configuration
   "serverIpAddress": "localhost", //ip address of the application server
   "serverPort": 5000, //Port on which the server runs
   "couchDbUrl": "http://localhost:5984", // couch db url
   "searchEngineUrl": "http://localhost:5986/_fti/local", // lucene url
   "userDbPrefix": "db_", //application user dbname prifix
   "adminDetails": { //application admin details
     "username": "admin",
     "password": "admin",
     "db": "common" //Common database for all users for storing web urls
   },
   "facebook": {
     "url": "https://graph.facebook.com/v2.8",
     "appSecretKey": "fb_appsecret", //facebook app appSecretKey
     "appId": "fb_appId", //App id of facebook app
     "timeOut": 2000, //timeout for request
     "limit": 500 //limit for data from fb for a source
   },
   "twitter": {
     "url": "https://api.twitter.com/1.1",
     "authenticateUrl": "https://api.twitter.com/oauth/authenticate",
     "consumerKey": "twitter_consumerKey", // twitter app consumer key
     "consumerSecret": "twitter_consumerSecret" // twitter app consumer secret
   }
 },
 "qa": { //environment specific, if we need diff config for qa environment you can add here

 }
}
```
	
### 4.b Client configuration:

The client config file is makenews/client/config/config.js
 

``` javascript
if(!window.mediaCenter) {
   window.mediaCenter = {};
}
window.mediaCenter.serverUrl = "";    //application server url
window.mediaCenter.facebookAppId = ""; //facebook appid
window.mediaCenter.autoRefreshSurfFeedsInterval = 300000; //time interval for refreshing feeds
window.mediaCenter.dbSessionInterval = 600000; //time interval for a login session
window.mediaCenter.storyAutoSaveTimeInterval = 300000; // time after which a story is auto saved
```


## 5. Troubleshoot:

* If twitter authentication page shows empty - While creating the twitter app, mention the makenews app url under the callback url, to redirect to the app after authentication
* If login failes and console shows CORS error - Ensure that the couchdb CORS is enabled
* If login failes - Make sure Couchdb is running before trying to log into the application 
* In case of error with facebook authentication - Facebook app( whose id is mentioned in the configuration file)  must be in active state, for the makenews app to be able to fetch data from Facebook
* If the default Web URL suggestion are not seen - check lucene if setup is properly done
* For Windows users, changing the server url to ‘localhost’ will not work, hence keep the server url to the default ‘127.0.0.1’
* Makenews is configured to work with facebook version of v2.10. There could be issues cropping up if a new version is released from Facebook, which might need fixes in the code

## 6. Developer options:

### 6.a Build and Tests:
The procedure to build the application, and get your changes working, are 
- gulp build          //build the application
- gulp test			//run unit test cases
- gulp eslint			//run static analyser
- gulp clean			//cleaning dist folder

*check the `gulpfile.js` for more gulp tasks*

### 6.b Migration:
If your change need data migration follow below steps:
1. New migration files can be written in the makenews/server/src/migration folder
2. Any migration, that has to change the common db, must be specified in the admin folder of migration
3. A migration for the user db, must be specified inside the db folder of migration
4. The migration data file should be named following the template of timestamp_filename
5. The migration file must contain an up method, for the db upgradation
6. A new condition must be added in the getObject method of the Migration.js file, for every new migration file created
7. The following command should be used for running the new migration
    ```
    node dist/server/src/migration.js [--admin_user_name='username' --admin_password='password']
    ```
 ## 6. Tips:   
* If you have some problems to install couchdb or to connect it to couchdb-lucene, just to know that if you have or use mac os - the installation is very faster and easier. The mac users install only the application couchdb and there is almost no manual configurations between couchdb and couchdb-lucene(just 2-3 line in the console) 
