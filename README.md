# Makenews

## How to build

### Prerequisites
1.  `node` and `npm`
2.  [couchdb 2.0.0](http://docs.couchdb.org/en/2.0.0/install/index.html)

### Create an admin user and common dabatase
1.  in `couchdb_tasks.sh` change the admin and common db details
    ```shell
    adminUserName="adminuser"
    adminPassword="adminpassword"
    commonDbName="commondb"
    commonDbUserName="commonuser"
    commonDbPassword="commonpassword"
    ```
2. `bash couchdb_tasks.sh`
    this will creates and admin user, common db, role access to common db,
    `_users` db, `_replicator` db and `_global_changes` db

### Build and Run
1.  make sure couchdb is running
2.  `npm install`
3.  `gulp build`
4.  `node dist/server`

your server will be running on `http://localhost:5000`


## Configuration
### Client configuration
path `./client/config/config.js`
```javascript
{
    window.mediaCenter.serverUrl = "http://localhost:5000";
    window.mediaCenter.facebookAppId = "148292852294882"; //replace with your facebook appId
    window.mediaCenter.autoRefreshSurfFeedsInterval = 300000; //(milliseconds) interval to request for the latest feeds
    window.mediaCenter.dbSessionInterval = 600000;//(milliseconds) 
    window.mediaCenter.storyAutoSaveTimeInterval = 300000; //(milliseconds)write story autosave time interval
}
```

### Server configuration
path `./server/config/application.json`
```javascript
{
  "default": {
    "serverIpAddress": "localhost",
    "serverPort": 5000,
    "couchDbUrl": "http://localhost:5984",
    "searchEngineUrl": "http://localhost:5986/_fti/local", //couchdb lucene url
    "userDbPrefix": "db_", //database prefix, when we create user we'll hash the username and prefix the db name with this
    "adminDetails": { //couchdb admin db details
      "username": "admin",
      "password": "password",
      "db": "common"
    },
    "facebook": { //replace appSecretKey and appId with your facebook app details
      "url": "https://graph.facebook.com/v2.8",
      "appSecretKey": "37jsj29sajhhgslbnsu10sajkhfoskj5",
      "appId": "648274661949018",
      "timeOut": 2000,
      "limit": 500
    },
    "twitter": { // replace consumerKey, Secret with your twitter app details
      "url": "https://api.twitter.com/1.1",
      "authenticateUrl": "https://api.twitter.com/oauth/authenticate",
      "consumerKey": "iJKWWLJGNW328klsjLJMUli89",
      "consumerSecret": "KSEM189INkma83jMLi389snhMUELLLKA839skhNKk3lkKskskIk"
    }
  },
  "development": {
  },
}
```


## Development

### Watch and run tests
1.  `gulp build`
2.  `gulp watch`
3.  `gulp test`

*check the `gulpfile.js` for more gulp tasks*
