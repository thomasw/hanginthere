#!/bin/bash

cd "`dirname $0`/.."

set -e

echo "Installing node dependencies..."

npm install
npm prune

platform=${1:-darwin}
arch=${2:-x64}

version=`node -e "console.log(require('./package.json').version);"`
name=`node -e "console.log(require('./package.json').productName);"`
electron_version=`
  npm ll -p --depth=0 electron-prebuilt |
  grep -o "@.*:" |
  sed 's/.$//; s/^.//'
`

echo "Building $name $version using Electron $electron_version..."

node_modules/.bin/electron-packager . $name \
  --platform=$platform \
  --arch=$arch \
  --version=$electron_version \
  --icon=src/img/icon.icns \
  --out=build \
  --app-version=$version \
  --overwrite

echo "Launching app..."

open build/HangInThere-$platform-$arch/$name.app

echo "Done!"
