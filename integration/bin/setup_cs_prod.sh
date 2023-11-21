#!/bin/bash

cd "$(dirname "$0")"

compose_files="-f ../compose/conversion-service.prod.yml"
project="conversion_service"
env_file="--env-file ../compose/.env"

docker compose ${env_file} ${compose_files} -p ${project} pull

docker compose ${env_file} ${compose_files} -p ${project} up -d cs_postgres

sleep 3

docker compose ${env_file} ${compose_files} -p ${project} run --user "$(id -u):$(id -g)" \
    -e NODE_ENV=development manager node ./scripts/setup.js --drop
docker compose ${env_file} ${compose_files} -p ${project} run --user "$(id -u):$(id -g)" \
    -e NODE_ENV=production manager node ./scripts/setup.js --drop

docker compose ${env_file} ${compose_files} -p ${project} down
