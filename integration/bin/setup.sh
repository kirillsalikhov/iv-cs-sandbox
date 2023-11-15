#!/bin/bash

cd "$(dirname "$0")"

compose_files="-f ../compose/sandbox.yml"
project="sandbox"

docker compose ${compose_files} -p ${project} pull

docker compose ${compose_files} -p ${project} run backend npm run setup

