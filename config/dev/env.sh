#!/usr/bin/env bash
# This is only used when **building** the release for dev. To change params
# when running with `npm start`, edit `app/lib/config.jsenv`
# Please avoid commit your modifications to this file

JS_ENV="dev"
HTTP_API_URL="http://localhost:4000"
WS_API_URL="ws://localhost:4000/socket"
FRONTEND_URL="http://localhost"
STATIC_RESOURCES_URL="http://localhost:4000/resources/" # Keep trailing /
FB_APP_ID="506726596325615"
