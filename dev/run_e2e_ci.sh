#!/usr/bin/env bash

# Start local API
docker-compose up -d

# Start Frontend
npm run dev &

# Waiting for Frontend to be ready
until curl -s localhost:3333 > /dev/null; do sleep 1; done

# Waiting for API to be ready
until curl localhost:4000; do sleep 1; done

# Run tests
npm run cypress
RETURN_CODE=$?

# Shutdown Frontend
kill $(jobs -p) || true

# Shutdown API
docker-compose down

exit $RETURN_CODE