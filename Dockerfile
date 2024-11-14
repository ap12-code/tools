FROM node:lts-alpine AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY svelte.config.js .
COPY vite.config.ts .
COPY src src
COPY static static

RUN apk update
RUN apk add bind-tools iputils-ping

RUN npm i -g npm@latest

RUN npm i --no-cache
RUN npm run build

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules /app/node_modules

RUN apk add bind-tools iputils-ping

CMD [ "node", "./build" ]