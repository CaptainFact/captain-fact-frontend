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
check_dependency () {
  command -v $1 >/dev/null 2>&1 || {
    print_error "Missing dependency: $1. Run npm install -g $1";
    exit 1;
  }
}
check_dependency "brunch"

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
  echo "[TODO] Running tests"

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
  source "./config/$BUILD_ENV/env.sh"
  echo "Building Frontend for env $BUILD_ENV:"
  echo "  - HTTP API:     $HTTP_API_URL"
  echo "  - WSS API:      $WS_API_URL"
  echo "  - Frontend URL: $FRONTEND_URL"
  echo "  - FB APP ID:    $FB_APP_ID"

  # Build and copy actual site
  HTTP_API_URL=${HTTP_API_URL} WS_API_URL=${WS_API_URL} FRONTEND_URL=${FRONTEND_URL} FB_APP_ID=${FB_APP_ID} JS_ENV=${JS_ENV} \
    npm run build || exit 1
  mkdir -p /var/www && rm -rf /var/www/*
  cp -R ./public/* /var/www

  # Copy robots.txt
  if [ "$BUILD_ENV" = "prod" ]; then
    cp "./rel/robots_public.txt" /var/www/robots.txt
  else
    cp "./rel/robots_private.txt" /var/www/robots.txt
  fi

  # Copy NGinx config
  FRONTEND_HOST=$(echo $FRONTEND_URL | sed -r "s/^https?:\/\///")
  cat ./config/nginx.conf | sed "s/SERVER_HOST/$FRONTEND_HOST/" > /etc/nginx/nginx.conf
  cp ./config/mime.types /etc/nginx/mime.types


# Serve
elif [ "$1" = "serve" ]; then
  # Start NGinx front
  nginx -g "daemon off;"

# Unknown command
else
  print_error "Unknown command $1"
  print_usage
  exit 1
fi
