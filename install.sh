#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

cd zkp-utils && npm ci && \
cd ../account-utils && npm ci && \
cd ../zkp && npm ci && \
chmod -R 777 node_modules/
npm run setup-all && cd ../
