#!/usr/bin/env bash
cd "$(dirname "$0")"

USER=$DEPLOY_USER
HOST=$DEPLOY_HOST
PROJECT="conversion_service"
REMOTE_PATH="/home/$USER/projects/$PROJECT"

# prepare folders
ssh -tt $USER@$HOST << EOF
mkdir -p $REMOTE_PATH
cd $REMOTE_PATH
mkdir -p compose
mkdir -p bin
exit
EOF

# coping compose and bin scripts
# !!! Copy .env manually to ./compose
scp ../compose/mod/conversion-service.prod.yml \
    $USER@$HOST:$REMOTE_PATH/compose/

scp ../bin/setup_cs_prod.sh \
    $USER@$HOST:$REMOTE_PATH/bin/setup_cs.sh

ssh -tt $USER@$HOST << EOF
cd $REMOTE_PATH/compose
docker compose -f conversion-service.prod.yml -p $PROJECT down
docker compose -f conversion-service.prod.yml -p $PROJECT pull
docker compose -f conversion-service.prod.yml -p $PROJECT up -d
exit
EOF
