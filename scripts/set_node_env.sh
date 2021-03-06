#!/usr/bin/env bash

MSG_PREFIX="[SET_NODE_ENV] "

# Set the runtime to a specific node version
NODE_VERSION=%NODE_RUNTIME_ENV%
echo $MSG_PREFIX"Enabling node version manager"
. ~/.nvm/nvm.sh
echo $MSG_PREFIX"Setting node env to "$NODE_VERSION
nvm use $NODE_VERSION