#!/usr/bin/env bash
echo '-------------------------------------------'
nodeVersion=$(node --version)

if [[ nodeVersion > 8.0 ]] || [[ nodeVersion == 8.0 ]]; then
  echo 'Current node version: '
  echo $nodeVersion
  echo 'node: passed'
else
  echo 'node version should be at least 4.0'
fi
echo '-------------------------------------------'
echo '\n'

###check couchdb
echo '-------------------------------------------'
couchdb=$(curl 'http://127.0.0.1:5986')

if [[ couchdb > 2.0 ]] || [[ couchdb == 2.0 ]]; then
  echo 'Current couchdb version: '
  echo $couchdb
  echo 'couchdb: passed'
else
  echo 'couchdb version should be at least 2.0'
fi
echo '-------------------------------------------'
echo '\n'

###check couchdb-lucene
echo '-------------------------------------------'
couchdbLucene=$(curl 'http://localhost:5985')

if [[ couchdbLucene > 2.0 ]] || [[ couchdbLucene == 2.0 ]]; then
  echo 'Current couchdb-lucene version: '
  echo $couchdbLucene
  echo 'couchdb-lucene: passed'
else
  echo 'couchdb-lucene version should be also at least 2.0'
fi
echo '-------------------------------------------'
echo '\n'



echo '-------------------------------------------'
gulpVersion=$(gulp --version)

if [[ gulpVersion ]]; then
  echo 'Gulp is installed!'
  echo $couchdbLucene
  echo 'gulp: passed'
else
  echo 'Install gulp'
fi
echo '-------------------------------------------'
echo '\n'
