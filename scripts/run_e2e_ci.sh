#!/usr/bin/env bash

# Start API
docker-compose up -d & wait-on localhost:4000

# Start Frontend
cd captain-fact-frontend
npm start & wait-on localhost:3333

# Run tests
npm run cypress:run
RETURN_CODE=$?

exit $RETURN_CODE
