#!/bin/bash

cd /opt/websites/michaelevy.github.io

echo "Starting deployment at $(date)"

# Pull latest code
git pull origin main

# Rebuild and restart containers
docker-compose down
docker-compose build --no-cache && docker-compose up -d

# Clean up old images
docker image prune -f

echo "Deployment complete at $(date)"
