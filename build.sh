#!/bin/sh

echo "--- npm install started"
npm install
if [ "$?" -ne 0 ]
then
  echo "*** npm install failed."
  exit
fi
echo "--- npm install completed"

#echo "--- npm rebuild node-sass started"
#npm rebuild node-sass
#if [ "$?" -ne 0 ]
#then
#  echo "*** npm rebuild node-sass failed."
#  exit
#fi
#echo "--- npm rebuild node-sass completed"

echo "--- gulp clean started"
gulp clean
if [ "$?" -ne 0 ]
then
  echo "*** gulp clean failed."
  exit
fi
echo "--- gulp clean completed"

echo "--- gulp build started"
NODE_ENV=production gulp build
if [ "$?" -ne 0 ]
then
  echo "*** gulp build failed."
  exit
fi
echo "--- gulp build completed"

echo "--- mobile initial setup started" 
gulp mobile:create
if [ "$?" -ne 0 ]
then
  echo "*** gulp mobile:create failed."
  exit
fi
echo "--- mobile initial setup completed" 

echo "--- mobile build started"
gulp mobile:build
if [ "$?" -ne 0 ]
then
  echo "*** gulp mobile:build failed."
  exit
fi
echo "--- mobile build completed"

echo "--- npm install only for dependencies started"
cd ./dist
npm install --production
if [ "$?" -ne 0 ]
then
  echo "*** npm install in dist folder failed."
  exit
fi
cd ..
echo "--- npm install only for dependencies completed"

echo "--- packaging dist folder started"
tar czf ./dist.tar.gz ./dist
if [ "$?" -ne 0 ]
then
  echo "*** packaging dist folder failed."
  exit
fi
echo "--- packaging dist folder completed"
