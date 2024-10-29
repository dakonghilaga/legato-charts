#!/bin/sh

# Docker timeout
export DOCKER_CLIENT_TIMEOUT=600

# docker-compose http timeout
export COMPOSE_HTTP_TIMEOUT=600

docker-compose up --build "$@"
