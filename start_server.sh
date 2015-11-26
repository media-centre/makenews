#!/bin/sh

killall node
node ./dist/server.js & 2>&1
