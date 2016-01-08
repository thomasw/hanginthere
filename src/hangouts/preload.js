'use strict';

/* globals Notification, MutationObserver */

const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const webFrame = require('web-frame');

const SpellCheckProvider = require('./spellcheck-provider');
const ContactListMonitor = require('./contact-list-monitor');

console.info('Preload script injected.');

var locale = remote.app.getLocale();
var contactListMonitor = new ContactListMonitor({Observer: MutationObserver});


function monitorContactList() {
  var contactList = document.querySelector('#gtn-roster-iframe-id-b');
  contactList = contactList.contentDocument;
  contactList = contactList.querySelector('.c-m.c-m-Ed.al.Mz.Ln');

  contactListMonitor.observe(contactList);
}

function notifyUser(message) {
  console.log('Message received. Notifying user.', message);

  var notification = new Notification(message.name, {
      body: message.text,
      icon: message.iconURL
  });

  notification.addEventListener('click', function() {
    console.log('Notification clicked.');
    remote.getCurrentWindow().show();
    message.dom_node.querySelector('button').click();
  });

  // Message main process for dock manipulation
}

webFrame.setSpellCheckProvider(locale, true, SpellCheckProvider);
setTimeout(monitorContactList, 5000);
contactListMonitor.on('message-received', notifyUser);
