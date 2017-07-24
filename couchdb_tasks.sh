#!/bin/sh

adminUserName="adminuser"
adminPassword="adminpassword"
commonDbName=commondb

sh ./couchdb_tasks_internal.sh $adminUserName $adminPassword $commonDbName
