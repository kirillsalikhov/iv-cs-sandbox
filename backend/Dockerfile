FROM node:16-bullseye-slim

RUN mkdir -p /backend
RUN mkdir -p /backend/db/data
WORKDIR /backend

COPY package* ./
RUN npm ci

COPY . .

CMD ["node", "app.js"]

