#!/usr/bin/env bash

source ./install.config

sh ./couchdb_tasks_internal.sh $userName $password $db

HOST=http://$userName:$password@127.0.0.1:5986
SERVER_URL=http://$serverIp:$port

curl -X PUT $HOST/_config/httpd/enable_cors -d '"true"'
curl -X PUT $HOST/_config/cors/origins -d '"'$SERVER_URL'"'
curl -X PUT $HOST/_config/cors/credentials -d '"true"'
curl -X PUT $HOST/_config/cors/methods -d '"GET, PUT, POST, HEAD, DELETE"'
curl -X PUT $HOST/_config/cors/headers -d '"accept, authorization, content-type, origin, referer, x-csrf-token"'

npm install

cat <<EOF > ./server/config/application.json
{
  "default": {
    "serverIpAddress": "$serverIp",
    "serverPort": $port,
    "couchDbUrl": "http://127.0.0.1:5984",
    "searchEngineUrl": "http://127.0.0.1:5986/_fti/local",
    "userDbPrefix": "db_",
    "adminDetails": {
      "username": "$userName",
      "password": "$password",
      "db": "$db"
    },
    "facebook": {
      "url": "https://graph.facebook.com/v2.8",
      "appSecretKey": "$fb_appSecretKey",
      "appId": "$fb_appId",
      "timeOut": 4000,
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
    window.mediaCenter.serverUrl = "$SERVER_URL";
    window.mediaCenter.facebookAppId = "$fb_appId";
    window.mediaCenter.autoRefreshSurfFeedsInterval = 300000;
    window.mediaCenter.dbSessionInterval = 600000;
    window.mediaCenter.storyAutoSaveTimeInterval = 300000;
EOF

gulp build

node ./dist/server/src/migration.js

cd dist

./create_user.sh


