FROM node:16-bullseye-slim

# docker-node, npm 8 has problems with root (npm not running as root)
# https://github.com/nodejs/docker-node/issues/1603
RUN npm i -g npm@9

RUN mkdir -p /frontend
RUN chown -R node:node /frontend
WORKDIR /frontend

COPY --chown=node:node package* ./
RUN npm ci

COPY --chown=node:node . .

RUN npm run build
