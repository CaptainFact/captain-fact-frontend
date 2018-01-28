#!/usr/bin/env bash
#
# Run an API on localhost from API docker dev image. This has been created mainly
# to simplify the procedure and for compatibility with windows
#
# Usage: ./rel/run_dev_docker_api.sh [--update]
#
# Options: --update Update API image from registry
#
# -------------------------------------------------------------------------------------

# ---- Configuration ----

DB_HOSTNAME="postgres_dev"
DOCKER_API_IMAGE="registry.gitlab.com/captainfact/captain-fact-api/rest:dev"
HTTP_PORT=4000
HTTPS_PORT=4001

# ---- Init ----

cd -- "$(dirname $0)"

# Pull API image
if [[ "$(docker images -q ${DOCKER_API_IMAGE} 2> /dev/null)" == "" ]] || [[ $1 == "--update" ]]; then
  # Login to Gitlab registry (if not already done) and pull image
  docker pull ${DOCKER_API_IMAGE} 2>/dev/null || \
    (echo "Please login to Gitlab to pull API image" && docker login registry.gitlab.com && docker pull ${DOCKER_API_IMAGE}) || exit 1
fi

# Create database container
COUNT=$(docker ps -a | grep "$DB_HOSTNAME" | wc -l)
if (($COUNT == 0)); then
  echo "Creating database..."
  docker run -d --name ${DB_HOSTNAME} -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=captain_fact_dev postgres:9.6 > /dev/null || exit 1
  sleep 2 # Wait for database to be created
fi

# ---- Run ----

# Start DB
docker start ${DB_HOSTNAME} > /dev/null && sleep 1

current_dir() {
  # Windows compatibility: replace /mnt/c/* by C:/* - docker will not find the directory otherwise
  pwd | sed "s/\/mnt\/c\//C:\//"
}

run_api() {
  docker run -it \
    -p ${HTTP_PORT}:4000 \
    -p ${HTTPS_PORT}:4001 \
    --link ${DB_HOSTNAME}:${DB_HOSTNAME} \
    -e "CF_HOST=localhost" \
    -e "CF_SECRET_KEY_BASE=CDe6dUDYXvs7vErdbvH/8hSlHrXgSIFgsR55pJk2xs2/1XoFMjwMn8Hw1ei+k9Gm" \
    -e "CF_DB_HOSTNAME=$DB_HOSTNAME" \
    -e "CF_DB_USERNAME=postgres" \
    -e "CF_DB_PASSWORD=postgres" \
    -e "CF_DB_NAME=captain_fact_dev" \
    -e "CF_FACEBOOK_APP_ID=xxxxxxxxxxxxxxxxxxxx" \
    -e "CF_FACEBOOK_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
    -e "CF_FRONTEND_URL=http://localhost:3333" \
    -e "CF_CHROME_EXTENSION_ID=chrome-extension://lpdmcoikcclagelhlmibniibjilfifac" \
    -v "$(pwd)/dev_docker_api_resources:/opt/app/resources" \
    --rm ${DOCKER_API_IMAGE} $1
}

echo "Migrating database..." && run_api migrate 1>/dev/null && \
echo "Seeding database..." && run_api seed 1>/dev/null && \
run_api console