'use strict';

const shell = require('shell');

const videoChatURLs = [
  'https://talkgadget.google.com/', 'https://plus.google.com/hangouts/'];
const allowedUrlPrefixes = [
  'https://hangouts.google.com/', 'https://accounts.google.com/AddSession',
  'https://accounts.google.com/ServiceLogin',
  'https://accounts.google.com/ServiceLoginAuth',
  'https://accounts.google.com/signin'
].concat(videoChatURLs);

const disallowedUrlPrefixes = [];

function urlAllowed(url) {
  var urlAllowableMatches = allowedUrlPrefixes.some((x) => {
    return url.startsWith(x);
  });

  var urlDisallowableMatches = disallowedUrlPrefixes.some((x) => {
    return url.startsWith(x);
  });

  return urlAllowableMatches && !urlDisallowableMatches;
}

var webContentHandlers = {
  'will-navigate': function(e, url) {
    console.log('BrowserWindow navigation attempt:', url);
    if(!urlAllowed(url)) {
      e.preventDefault();
      shell.openExternal(url);
    }
  },
  'new-window': function(e, url) {
    console.log('BrowserWindow new window invokation attempt:', url);
    if(!urlAllowed(url)) {
      e.preventDefault();
      shell.openExternal(url);
    }
  }
};

function bindWindowEvents(window) {
  for(var event in webContentHandlers) {
    window.webContents.on(event, webContentHandlers[event]);
  }
}

module.exports = bindWindowEvents;
