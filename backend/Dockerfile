FROM node:16-bullseye-slim

RUN mkdir -p /backend
WORKDIR /backend

COPY package* ./
RUN npm ci

COPY . .

CMD ["node", "app.js"]

