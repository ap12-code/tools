FROM node:lts-alpine AS builder

WORKDIR /app

COPY . .

RUN apk update
RUN apk add bind-tools iputils-ping

RUN yarn install
RUN yarn run build

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules /app/node_modules

RUN apk add bind-tools iputils-ping

ENV BODY_SIZE_LIMIT=102400
CMD [ "node", "./build" ]