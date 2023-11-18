#!/bin/bash

cd "$(dirname "$0")"

compose_files="-f ../compose/conversion-service.prod.yml"

docker compose ${compose_files} -p sandbox pull

docker compose ${compose_files} -p sandbox up -d cs_postgres

sleep 3

docker compose ${compose_files} -p sandbox run --user "$(id -u):$(id -g)" \
    -e NODE_ENV=development manager node ./scripts/setup.js --drop
docker compose ${compose_files} -p sandbox run --user "$(id -u):$(id -g)" \
    -e NODE_ENV=production manager node ./scripts/setup.js --drop

docker compose ${compose_files} -p sandbox down
