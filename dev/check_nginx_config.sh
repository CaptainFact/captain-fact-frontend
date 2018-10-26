#!/usr/bin/env bash

docker run -v `pwd`/config:/config nginx nginx -t -c /config/nginx.conf