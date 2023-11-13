#!/bin/bash

usage="
Script usage:
  bin/main.sh [--mod=MOD_LETTERS] {up|down|stop|other docker-compose cmd}

MOD_LETTERS:
  b - backend : backend
  f - frontend : frontend
Examples:
  main.sh up // all container in prod mode

  // start certain containers in dev mode
  main.sh --mod=b up // backend
  ----
"

cd "$(dirname "$0")"

if [[ -z $@ ]]; then
    echo "$usage"
fi

ARGS=()
dev=''
for i in "$@"
do
    if [[ $i == "--mod="* ]]
    then
        dev="${i#*=}"
        shift
    else
        ARGS+=("$i")
    fi
done

prod_compose="-f ../compose/sandbox.yml"

dev_compose=()

for l in $(echo ${dev} | grep -o .)
do
    case $l in
        b)
            echo "MOD backend : backend in dev mode"
            dev_compose+=" -f ../compose/mod/backend.yml"
        ;;
        f)
            echo "MOD frontend : frontend in dev mode"
            dev_compose+=" -f ../compose/mod/frontend.yml"
        ;;
    esac
done

docker compose ${prod_compose} ${dev_compose} -p sandbox "${ARGS[@]}"
