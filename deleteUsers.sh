### print the current version of curl
curl -V

###delete all users
##change the http if your username in couchdb is not admin with
## with password admin - ..//username:password@127...

curl -X DELETE http://admin:admin@127.0.0.1:5984/_users

###delete certain user
#curl -X DELETE http://admin:admin@127.0.0.1:5984/_users/org.couchdb.user:foo
