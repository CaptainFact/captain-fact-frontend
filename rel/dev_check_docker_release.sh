#!/usr/bin/env bash
#-------------------------------------------------------------------
# Build the docker image and try to run it as prod would do but
# with dev environment
#-------------------------------------------------------------------

IMAGE_TAG="captain-fact-frontend:dev-test-build"

# Build image and run it
docker build -t "$IMAGE_TAG" --build-arg BUILD_ENV=dev . && \
  docker run --rm -it \
  -v $(pwd)/rel/dev_localhost_keys:/run/secrets \
  -p 80:80 \
  -p 443:443 \
  "$IMAGE_TAG" serve

# Cleanup
# docker rmi "$IMAGE_TAG"