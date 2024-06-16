FROM node:lts-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY svelte.config.js .
COPY vite.config.ts .
COPY src src
COPY static static

RUN apk add --no-cache bind-tools iputils-ping
RUN npm i
RUN npm run build

CMD [ "node", "./build" ]