FROM node:16-bullseye-slim

# docker-node, npm 8 has problems with root (npm not running as root)
# https://github.com/nodejs/docker-node/issues/1603
RUN npm i -g npm@9

RUN mkdir -p /backend
RUN mkdir -p /backend/db/data
WORKDIR /backend

COPY package* ./
RUN npm ci

COPY . .

CMD ["node", "app.js"]

