FROM node:16-bullseye-slim

RUN mkdir -p /frontend
WORKDIR /frontend

COPY package* ./
RUN npm ci

COPY . .

RUN npm run build
