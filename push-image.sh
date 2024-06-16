#!/bin/bash

docker build . -t docker-registry.ap12.net/tools-komaken:latest
docker push docker-registry.ap12.net/tools-komaken:latest