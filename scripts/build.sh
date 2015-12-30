#!/bin/bash

cd "`dirname $0`/.."

set -e

VERSION=`node -e "console.log(require('./package.json').version);"`
NAME=`node -e "console.log(require('./package.json').productName);"`

echo "Building $NAME $VERSION"

node_modules/.bin/electron-packager . $NAME \
--platform=darwin \
--arch=x64 \
--version=0.36.2 \
--icon=src/img/icon.icns \
--out=build \
--app-version=$VERSION \
--overwrite

open build/HangInThere-darwin-x64/HangInThere.app
