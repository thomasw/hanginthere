'use strict';

/* globals Notification */

const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const webFrame = require('web-frame');
const spellchecker = require('spellchecker');

console.info('Preload script injected.');

webFrame.setSpellCheckProvider('en-US', true, {
  spellCheck: function(text) {
    return !spellchecker.isMisspelled(text);
  }
});

ipcRenderer.on('notification', function() {
  var notification = new Notification(
    'New message...', {body: 'You have messages waiting.'});

  notification.addEventListener('click', function() {
    console.log('Notification clicked.');
    remote.getCurrentWindow().show();
  });

});
