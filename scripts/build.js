#!/usr/bin/env node
'use strict';

const path = require('path');
const electronPackager = require('electron-packager');
const minimist = require('minimist');

var argv = minimist(process.argv.slice(2));
var arch = argv.arch || argv.a || 'x64';
var platform = argv.platform || argv.p || 'darwin';

var packageInfo = require(path.join(__dirname, '../package.json'));
var electronPackageInfo = require(path.join(
  __dirname, '../node_modules/electron-prebuilt/package.json'));

var version = packageInfo.version;
var productName = packageInfo.productName;

console.log(`Building ${productName} ${version}.`);

var buildArgs = {
  dir: path.join(__dirname, '../'),
  name: productName,
  arch: arch,
  platform: platform,
  version: electronPackageInfo.version,
  icon: path.join(__dirname, '../src/img/icon.cns'),
  out: path.join(__dirname, '../build/'),
  'app-version': version,
  overwrite: true
};

console.log('Build args', buildArgs);

function processBuildResult(err, appPath) {
  if (err) {
    console.log('Build failed.');
    console.log(err);
    return;
  }

  console.log('Build successful.');
  console.log(appPath);
}

electronPackager(buildArgs, processBuildResult);
