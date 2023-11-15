#!/bin/bash

function load_env() {
  source ./../compose/.env
}

function minio_setup() {
  # -net=host - needed for 127.0.0.1 to be host
  # default-bucket - our name
  docker run --net=host --entrypoint sh minio/mc:RELEASE.2023-10-24T21-42-22Z -c "
    mc config host add minio http://127.0.0.1:10000 $SANDBOX__MINIO_ROOT_USER $SANDBOX__MINIO_ROOT_PASSWORD
    mc mb minio/default-bucket
    "
}

cd "$(dirname "$0")"

compose_files="-f ../compose/sandbox.yml"
project="sandbox"

docker compose ${compose_files} -p ${project} pull

docker compose ${compose_files} -p ${project} up -d minio_for_backend
sleep 1
load_env
minio_setup

docker compose ${compose_files} -p ${project} run backend npm run setup

docker compose ${compose_files} -p ${project} down
