FROM node:20-bullseye-slim

# docker-node, npm 8 has problems with root (npm not running as root)
# https://github.com/nodejs/docker-node/issues/1603
# TODO maybe remove after check in bash inside container
RUN npm i -g npm@9

RUN mkdir -p /backend
RUN mkdir -p /backend/db/data
WORKDIR /backend

COPY package* ./
COPY cs-open-api-gen/cs-open-api-* ./cs-open-api-gen/
RUN npm ci

COPY . .

CMD ["node", "app.js"]

