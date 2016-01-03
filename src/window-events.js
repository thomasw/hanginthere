'use strict';

const shell = require('electron').shell;

const allowedUrlPrefixes = [
  'https://hangouts.google.com/', 'https://talkgadget.google.com/'];


var webContentHandlers = {
  'will-navigate': function(e, url) {
    console.log('BrowserWindow navigation attempt:', url);
    e.preventDefault();
    shell.openExternal(url);
  },
  'new-window': function(e, url) {
    console.log('BrowserWindow new window invokation attempt:', url);
    var urlAllowed = allowedUrlPrefixes.some(function(x) {
      return url.startsWith(x);
    });

    if(!urlAllowed) {
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
