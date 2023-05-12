#!/bin/bash

git pull
docker compose -f ./docker-compose.prod.yml down
docker rmi app-node
docker rmi app-automation
docker compose -f ./docker-compose.prod.yml up -d
