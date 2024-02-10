FROM node:20-bullseye-slim

RUN mkdir -p /backend
RUN mkdir -p /backend/db/data
WORKDIR /backend

COPY package* ./
COPY cs-open-api-gen/cs-open-api-* ./cs-open-api-gen/
RUN npm ci

COPY . .

CMD ["node", "app.js"]

