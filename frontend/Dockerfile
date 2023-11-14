FROM node:16-bullseye-slim

RUN mkdir -p /frontend
WORKDIR /frontend

COPY package* .npmrc ./
RUN npm ci

COPY . .
