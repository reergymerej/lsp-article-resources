#!/usr/bin/env bash

# create the language server
mkdir blacklist-server
cd blacklist-server

# copy source from repo
curl https://raw.githubusercontent.com/reergymerej/lsp-article-resources/master/blacklist-server/package.json -o package.json
curl https://raw.githubusercontent.com/reergymerej/lsp-article-resources/master/blacklist-server/index.js -o index.js

# make it executable
npm link
