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


#ssh -tt $USER@$HOST << EOF
#cd $REMOTE_PATH
# TODO no main.sh, should be compose
# ALSO add project name to be line cs or conversions_service or ...
#bin/main.sh pull \
#&& bin/main.sh down \
#&& bin/main.sh up -d
#
#exit
#EOF
