#!/usr/bin/env bash
#---------------------------------------------------------------------------
# Run a nginx server using docker and the nginx.conf file on localhost
# Project must have been built using `JS_ENV=prod brunch build --production`
#----------------------------------------------------------------------------

docker run -it --rm \
  -p 80:80 \
  -p 443:443 \
  -v $(pwd)/public:/usr/html \
  -v $(pwd)/release/nginx.conf:/etc/nginx/nginx.conf \
  -v $(pwd)/release/dev_localhost_keys:/etc/nginx/cert \
  nginx:alpine