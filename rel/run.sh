#!/bin/sh
#----------------------------------------------------------------------------
# This script is used by the production server to run the app.
# The command "dev" can be used locally to test the app on localhost with
# https activated
#----------------------------------------------------------------------------


# Pre-run : Check dependencies

print_error() {
  >&2 echo "Error: $1"
}

# Check args
print_usage () {
  echo "Usage: run.sh COMMAND"
  echo "------------------------------------------"
  echo "Commands:"
  echo "  * test"
  echo "  * build ENV"
  echo "  * serve"
}

if [ "$#" -lt 1 ]; then
  print_usage
  exit 1
fi

# Test - only compile for now
if [ "$1" = "test" ]; then
  npm test

# Build
elif [ "$1" = "build" ]; then
  if [ "$#" -lt 2 ]; then
    print_usage
    exit 1
  fi

  # Load appropriate build config. If not dev or staging, build for prod (could be master branch or tag)
  BUILD_ENV=$2
  if [ "$BUILD_ENV" != "dev" ] && [ "$BUILD_ENV" != "staging" ] ; then
    BUILD_ENV="prod"
  fi
  source "./config/env/$BUILD_ENV.env"
  echo "---------------------------------------------"
  echo "Building Frontend for env $BUILD_ENV:"
  echo "  - REST API:     $HTTP_API_URL"
  echo "  - GRAPHQL API:  $GRAPHQL_API_URL"
  echo "  - WSS API:      $WS_API_URL"
  echo "  - OG:           $OG_URL"
  echo "  - Frontend URL: $FRONTEND_URL"
  echo "  - FB APP ID:    $FB_APP_ID"
  echo ""
  echo "Node:" `node --version`
  echo "NPM:" `npm --version`
  echo "---------------------------------------------"

  # Create initial structure
  mkdir -p /var/www && rm -rf /var/www/*
  mkdir /var/www/captain_fact /var/www/maintenance

  # Copy robots.txt
  if [ "$BUILD_ENV" = "prod" ]; then
    cp "./rel/robots_public.txt" /var/www/captain_fact/robots.txt
  else
    cp "./rel/robots_private.txt" /var/www/captain_fact/robots.txt
  fi
  cp /var/www/captain_fact/robots.txt /var/www/maintenance/robots.txt

  # Copy NGinx config
  FRONTEND_HOST=$(echo ${FRONTEND_URL} | sed -r "s/^https?:\/\///")
  HTTP_API_BASE_URL=$(echo ${HTTP_API_URL} | sed -E 's,(https?://)([^/]+).*,\1\2,')
  GRAPHQL_API_BASE_URL=$(echo ${GRAPHQL_API_URL} | sed -E 's,(https?://)([^/]+).*,\1\2,')
  WS_API_BASE_URL=$(echo ${WS_API_URL} | sed -E 's,(wss?://)([^/]+).*,\1\2,')
  OG_BASE_URL=${OG_URL}

  cat ./config/nginx.conf \
    | sed "s/FRONTEND_HOST/$FRONTEND_HOST/" \
    | sed "s,HTTP_API_BASE_URL,$HTTP_API_BASE_URL,g" \
    | sed "s,GRAPHQL_API_BASE_URL,$GRAPHQL_API_BASE_URL,g" \
    | sed "s,WS_API_BASE_URL,$WS_API_BASE_URL,g" \
    | sed "s,OG_BASE_URL,$OG_BASE_URL,g" \
    | sed "s,STATIC_RESOURCES_URL,$STATIC_RESOURCES_URL,g" \
    | tee /etc/nginx/captain_fact.conf /etc/nginx/nginx.conf
  cat /etc/nginx/captain_fact.conf | sed "s/captain_fact/maintenance/" > /etc/nginx/maintenance.conf
  cp ./config/mime.types /etc/nginx/mime.types

  # Build
  HTTP_API_URL=${HTTP_API_URL} \
  GRAPHQL_API_URL=${GRAPHQL_API_URL} \
  WS_API_URL=${WS_API_URL} \
  FRONTEND_URL=${FRONTEND_URL} \
  FB_APP_ID=${FB_APP_ID} \
  JS_ENV=${JS_ENV} \
    npm run build || exit 1

  # Copy actual site and maintenance site
  mv ./public/* /var/www/captain_fact
  cp ./rel/maintenance.html /var/www/maintenance/index.html
  cp ./app/assets/assets/img/logo.png ./app/assets/favicon.ico /var/www/maintenance

# Serve
elif [ "$1" = "serve" ]; then
  # Set appropriate configuration
  if [ "$MAINTENANCE_MODE" = "on" ] || [ "$MAINTENANCE_MODE" = "ON" ]; then
    cp /etc/nginx/maintenance.conf /etc/nginx/nginx.conf
  else
    cp /etc/nginx/captain_fact.conf /etc/nginx/nginx.conf
  fi

  # Start NGinx front
  nginx -g "daemon off;"

# Unknown command
else
  print_error "Unknown command $1"
  print_usage
  exit 1
fi
