#!/bin/sh
service nginx stop  # or whatever your webserver is
if ! /opt/letsencrypt/letsencrypt-auto renew -nvv --standalone > /var/log/letsencrypt/renew.log 2>&1 ; then
    echo Automated renewal failed:
    cat /var/log/letsencrypt/renew.log
    exit 1
fi
service nginx start # or whatever your webserver is