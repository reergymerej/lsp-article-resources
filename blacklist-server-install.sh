#!/usr/bin/env bash

# create the language server
mkdir blacklist-server
cd blacklist-server

# copy source from repo
curl -L https://bit.ly/2KS2zm8 -o package.json
curl -L https://bit.ly/37DRUoU -o index.js

# make it executable
npm link
