#!/usr/bin/env bash

source ./install.config

sh ./couchdb_tasks_internal.sh $userName $password $db

npm install

cat <<EOF > ./server/config/application.json
{
  "default": {
    "serverIpAddress": "localhost",
    "serverPort": 5000,
    "couchDbUrl": "$couchDbUrl",
    "searchEngineUrl": "$searchEngineUrl",
    "userDbPrefix": "db_",
    "adminDetails": {
      "username": "$userName",
      "password": "$password",
      "db": "$db"
    },
    "facebook": {
      "url": "https://graph.facebook.com/v2.8",
      "appSecretKey": "$fb_appSecretKey",
      "appId": "fb_appId",
      "timeOut": 2000,
      "limit": 500
    },
    "twitter": {
      "url": "https://api.twitter.com/1.1",
      "authenticateUrl": "https://api.twitter.com/oauth/authenticate",
      "consumerKey": "$tw_consumerKey",
      "consumerSecret": "$tw_consumerSecret"
    }
  }
}
EOF

cat <<EOF > ./client/config/config.js
    if(!window.mediaCenter) {
        window.mediaCenter = {};
    }
    window.mediaCenter.serverUrl = "http://localhost:5000";
    window.mediaCenter.facebookAppId = $fb_appId;
    window.mediaCenter.autoRefreshSurfFeedsInterval = 300000;
    window.mediaCenter.dbSessionInterval = 600000;
    window.mediaCenter.storyAutoSaveTimeInterval = 300000;
EOF

gulp build

node ./dist/server/src/migration.js

cd dist

./create_user.sh


