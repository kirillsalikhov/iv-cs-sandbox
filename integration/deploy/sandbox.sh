#!/usr/bin/env bash
cd "$(dirname "$0")"

USER=$DEPLOY_USER
HOST=$DEPLOY_HOST
PROJECT="sandbox"
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
scp ../compose/conversion-service.prod.yml ../compose/sandbox.yml \
    $USER@$HOST:$REMOTE_PATH/compose/

scp ../bin/main.sh ../bin/setup.sh \
    $USER@$HOST:$REMOTE_PATH/bin/



ssh -tt $USER@$HOST << EOF
cd $REMOTE_PATH
bin/main.sh pull \
&& bin/main.sh down \
&& bin/main.sh up -d

exit
EOF
