'use strict';

const shell = require('shell');

const videoChatURLs = [
  'https://talkgadget.google.com/', 'https://plus.google.com/hangouts/'];
const allowedUrlPrefixes = [
  'https://hangouts.google.com/', 'https://accounts.google.com/'
].concat(videoChatURLs);

var webContentHandlers = {
  'will-navigate': function(e, url) {
    console.log('BrowserWindow navigation attempt:', url);
    var urlAllowed = allowedUrlPrefixes.some(function(x) {
      return url.startsWith(x);
    });

    if(!urlAllowed) {
      e.preventDefault();
      shell.openExternal(url);
    }
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
  },
  'media-started-playing': function(e) {
    var url = this.getURL();
    var isVideoChat = allowedUrlPrefixes.some(function(x) {
      url.startsWith(x);
    });

    if(isVideoChat) {
      return;
    }

    this.send('notification');
  }
};

function bindWindowEvents(window) {
  for(var event in webContentHandlers) {
    window.webContents.on(event, webContentHandlers[event]);
  }
}

module.exports = bindWindowEvents;
