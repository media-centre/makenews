#!/usr/bin/env bash
echo "--- creating couchdb admin username and password"
curl -g -X PUT http://127.0.0.1:5986/_config/admins/$1 -d '"'$2'"' 2>/dev/null
if [ "$?" -ne 0 ]
then
  echo "*** creation of admin account failed."
fi
echo "--- creation of admin account completed. May be success or failed"

echo "--- creating common db"

curl -g -X PUT http://"$1":"$2"@127.0.0.1:5984/$3 2>/dev/null
if [ "$?" -ne 0 ]
then
  echo "*** creation of common db failed."
fi
echo "--- creation of common db completed. May be success or failed"

echo "--- creating _users DB"
curl -X PUT http://"$1":"$2"@127.0.0.1:5984/_users
if [ "$?" -ne 0 ]
then
  echo "*** creating _users db failed."
fi
echo "--- creating _users db is completed. may be success of failed."

echo "--- creating _replicator"
curl -X PUT http://"$1":"$2"@127.0.0.1:5984/_replicator
if [ "$?" -ne 0 ]
then
  echo "*** creating _replicator db failed."
fi
echo "--- creating _replicator db is completed. may be success of failed."

echo "--- creating _global_changes"
curl -X PUT http://"$1":"$2"@127.0.0.1:5984/_global_changes
if [ "$?" -ne 0 ]
then
  echo "*** creating _global_changes db failed."
fi
echo "--- creating _global_changes db is completed. may be success of failed."