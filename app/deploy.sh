#!/bin/bash

# get latest code changes
git pull

# turn off the stack and remove old container versions
docker compose -f ./docker-compose.prod.yml down
docker rmi app-node
docker rmi app-automation

# rebuild new container and start stack
docker compose -f ./docker-compose.prod.yml up -d

# follow the stack logs
docker compose logs -f