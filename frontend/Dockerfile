FROM node:16-bullseye-slim

RUN mkdir -p /frontend
RUN chown -R node:node /frontend
WORKDIR /frontend

COPY --chown=node:node package* ./
USER node
RUN npm ci

COPY --chown=node:node . .

RUN npm run build
