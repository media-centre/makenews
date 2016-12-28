#!/bin/sh

adminUserName="adminuser"
adminPassword="adminpassword"
commonDbName=commondb
commonDbUserName=commonuser
commonDbPassword="commonpassword"

echo "--- creating couchdb admin username and password"
curl -g -X PUT http://localhost:5984/_config/admins/$adminUserName -d '"'$adminPassword'"' 2>/dev/null
if [ "$?" -ne 0 ]
then
  echo "*** creation of admin account failed."
fi
echo "--- creation of admin account completed. May be success or failed"

echo "--- creating common db"

curl -g -X PUT http://"$adminUserName":"$adminPassword"@localhost:5984/$commonDbName 2>/dev/null
if [ "$?" -ne 0 ]
then
  echo "*** creation of common db failed."
fi
echo "--- creation of common db completed. May be success or failed"

echo "--- creating common db role access"
curl -g -X PUT http://"$adminUserName":"$adminPassword"@localhost:5984/$commonDbName/_security -d '{ "admins": { "names": [], "roles": [] }, "members": { "names": ["'$adminUserName'"], "roles": [] } }' 2>/dev/null
if [ "$?" -ne 0 ]
then
  echo "*** creating common db role access failed."
fi
echo "--- creating common db is completed. may be success of failed."
